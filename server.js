const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Path to our counter file
const countFilePath = path.join(__dirname, 'count.json');
const initialData = { "totalApes": 0 };

// Serve the static files (HTML, CSS, JS) from the current directory
app.use(express.static(__dirname));

// API Endpoint: GET the current count
app.get('/api/count', (req, res) => {
    fs.readFile(countFilePath, 'utf8', (err, data) => {
        if (err) {
            // If file doesn't exist, return initial data
            if (err.code === 'ENOENT') {
                return res.json(initialData);
            }
            console.error(err);
            return res.status(500).json({ error: 'Could not read count file.' });
        }
        // **NEW:** If file is empty, return initial data
        if (!data) {
            return res.json(initialData);
        }
        res.json(JSON.parse(data));
    });
});

// API Endpoint: POST to increment the count
app.post('/api/increment', (req, res) => {
    fs.readFile(countFilePath, 'utf8', (err, data) => {
        let countData;
        if (err || !data) {
            // **NEW:** If file is empty or doesn't exist, start from the initial value
            countData = initialData;
        } else {
            countData = JSON.parse(data);
        }

        countData.totalApes++; // Increment the count

        fs.writeFile(countFilePath, JSON.stringify(countData, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Could not save new count.' });
            }
            res.json(countData); // Send back the new count
        });
    });
});

// You'll also need an endpoint for the banana bonus
app.post('/api/add-bonus', (req, res) => {
    fs.readFile(countFilePath, 'utf8', (err, data) => {
        let countData;
        if (err || !data) {
            countData = initialData;
        } else {
            countData = JSON.parse(data);
        }

        countData.totalApes += 5; // Add bonus points

        fs.writeFile(countFilePath, JSON.stringify(countData, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Could not save new count.' });
            }
            res.json(countData);
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});