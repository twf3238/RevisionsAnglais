const fetch = require('node-fetch');

exports.handler = async () => {
    const AIRTABLE_BASE_ID = 'appu2zFKRQzZkCUkC'; // Remplacez par votre Base ID
    const AIRTABLE_TABLE_NAME = 'Exercices'; // Nom de votre table
    const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
    const AIRTABLE_ACCESS_TOKEN = patTlNKpueJ6jGFgx.55d7a901c50a640cbfb1451f9594531f9065d56620f4d4fadfc5601e316942aa // process.env.AIRTABLE_ACCESS_TOKEN; //patTlNKpueJ6jGFgx.55d7a901c50a640cbfb1451f9594531f9065d56620f4d4fadfc5601e316942aa

    try {
        const response = await fetch(AIRTABLE_URL, {
            headers: {
                Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur API : ${response.statusText}`);
        }

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Erreur dans la fonction Netlify :', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erreur serveur' }),
        };
    }
};