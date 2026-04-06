import https from 'https';

https.get('https://docs.google.com/spreadsheets/d/1rijyU4lKdpO5GfO3ghl1WnyvvNc6Az-M/htmlview', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const regex = /<li id="sheet-button-(.*?)"><a href=".*?">(.*?)<\/a><\/li>/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
      console.log(`GID: ${match[1]}, Name: ${match[2]}`);
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
