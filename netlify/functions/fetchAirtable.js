const axios = require('axios');

exports.handler = async (event, context) => {
    const AIRTABLE_ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN;
    const BASE_ID = process.env.AIRTABLE_BASE_ID;
    const TABLE_NAME = 'Exercices'; // Changez selon vos besoins

    try {
        const response = await axios.get(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`, {
            headers: {
                Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data.records),
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des données Airtable :', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erreur serveur' }),
        };
    }
};