//Llamamos a la API
const COHERE_API_KEY = "lEWhVXikvzfjqHhvVLvqQLD8J2Qdo3gNliDDQO2x"
const COHERE_API_GENERATE_URL = "https://api.cohere.ai/generate"
const COHERE_API_DETECT_LENGUAJE_URL = "https://api.cohere.ai/detect-language"

//Funcion para corroborar el idioma del texto
export async function checkIsEnglish(input) {
    const data = {
        texts: [input]
    }
    const { results } =await fetch(COHERE_API_DETECT_LENGUAJE_URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization : `Authorization: BEARER ${COHERE_API_KEY}`,
            "Content-Type": 'application/json',
            "Cohere-Version": '2022-12-06'
        },
        body: JSON.stringify(data)
    }).then(res => res.json());

    
    const [{ lenguage_code }] = results[0]
    return lenguage_code === 'en'
}

//Funcion para traducir el texto
export async function fixMyEnglish(input){
    const data = {
        
        model: "xlarge",
        prompt: `This is a spell checker generator
    --
            Incorrect sample: "I are good!"
            Correct sample: "I am good!"
    --
        Incorrect sample: "I have 22 years old."
        Correct sample: "I am 22 years old."
    --
        Incorrect sample: "I dont can know"
        Correct sample: "I dont  know"
    --
        Incorrect sample: "${input}
        Correct sample:`,
            max_toxens : 40,
            temperature: 0.3,
            k: 0,
            p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop_sequences: ["--"],
            return_likelihoods: "NONE",   
           }
    const response =await fetch(COHERE_API_GENERATE_URL, {
        method: 'POST',
        headers: {
            Authorization : `Authorization: BEARER ${COHERE_API_KEY}`,
            "Content-Type": 'application/json',
            "Cohere-Version": '2022-12-06'
        },
        body: JSON.stringify(data)
    }).then(res => res.json());

    console.log("No anda la API porque hay que pagar una mensualidad, el error es el siguiente =" + response)
  
    /*Recuperamos el texto de la API*/ 
    const { text } = response.generations[0]

    return text
    .replace('--', '')
    .replaceAll('"', '')
    .trim()
}