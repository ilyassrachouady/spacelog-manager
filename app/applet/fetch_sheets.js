async function main() {
  const res = await fetch('https://docs.google.com/spreadsheets/d/1rijyU4lKdpO5GfO3ghl1WnyvvNc6Az-M/htmlview');
  const data = await res.text();
  console.log("Downloaded " + data.length + " bytes");
  const regex = /<li id="sheet-button-(.*?)"><a href=".*?">(.*?)<\/a><\/li>/g;
  let match;
  while ((match = regex.exec(data)) !== null) {
    console.log(`GID: ${match[1]}, Name: ${match[2]}`);
  }
}
main();
