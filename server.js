const express = require('express');
      path    = require('path');

const app = express();

app.use(express.static('./dist/Lissandra-Project'));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/Lissandra-Project/index.html'));
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started.');
});