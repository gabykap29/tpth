const form = document.getElementById('myForm');
const imgInput = document.getElementById('myImage');
const result = document.getElementById('result');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    result.innerHTML = `
    <div class="spinner-border text-primary" role="status">
  <span class="visually-hidden">Loading...</span>
</div>

    `;
    // Obtener el modelo de MobileNet
    const model = await mobilenet.load();

    // Crear una instancia de FileReader para leer el archivo de imagen seleccionado
    const reader = new FileReader();

    // Definir la función de devolución de llamada que se ejecutará cuando se cargue el archivo
    reader.onload = async function(event) {
        // Crear un elemento de imagen para mostrar la imagen cargada

        const imgElement = document.createElement('img');
        imgElement.src = event.target.result;

        // Esperar a que la imagen se cargue completamente
        await new Promise(resolve => { imgElement.onload = resolve; });

        // Convertir la imagen cargada en un tensor
        const tensorImage = tf.browser.fromPixels(imgElement);

        // Clasificar la imagen
        const predictions = await model.classify(tensorImage);
        console.log('Predictions: ', predictions);

        // Verificar si se detectó un camión
        const prediction = predictions[0];
        console.log('Prediction: ', prediction);
        result.innerHTML = prediction.className + ' ' + (prediction.probability.toFixed(2) * 100)+ '%';
        result.innerHTML += '<br><img width="300" src="'+imgElement.src+'">';
    };

    // Leer el archivo de imagen seleccionado por el usuario como una URL de datos
    reader.readAsDataURL(imgInput.files[0]);
});
