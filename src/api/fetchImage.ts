export default (hash: string) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = () => reject();
  image.src = `https://robohash.org/${hash}`;
});
