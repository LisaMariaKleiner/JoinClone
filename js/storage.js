const STORAGE_TOKEN = 'YH44XN2GXFLHXSKEA1UVADT2UJSIDURB5JQY28A3';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
let users = [];
let successFeedback = document.getElementById('success_feedback');

async function loadUsers(){
    try {
        users = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
}

async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    try {
        const response = await fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Fehler beim Abrufen von Daten:', error);
        throw error;
    }
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        // Verbesserter code
        if (res.data) { 
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}