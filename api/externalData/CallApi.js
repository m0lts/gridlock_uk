export default async function handler(request, response) {
    try {
        if (request.method === "POST") {
            const endPointRequest = request.body;

            var myHeaders = new Headers();
            myHeaders.append("x-rapidapi-key", process.env.RAPIDAPI_KEY);
            myHeaders.append("x-rapidapi-host", "v1.formula-1.api-sports.io");

            // Remove specific headers that might interfere
            myHeaders.delete('Referer');
            myHeaders.delete('Origin');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
        
            fetch(`https://v1.formula-1.api-sports.io/${endPointRequest}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                response.status(200).json({ result })
            })
            .catch(error => console.log('error', error));

            
        }
    } catch (error) {
        console.error(error);
    }

}