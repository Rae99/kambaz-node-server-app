export default function QueryParameters(app) {
  const calculator = (req, res) => {
    const { a, b, operation } = req.query;
    let result = 0;
    switch (operation) {
      case 'add':
        result = parseInt(a) + parseInt(b);
        break;
      case 'subtract':
        result = parseInt(a) - parseInt(b);
        break;
      case 'multiply':
        result = parseInt(a) * parseInt(b);
        break;
      case 'divide':
        result = parseInt(a) / parseInt(b);
        break;
      default:
        result = 'Invalid operation';
    }
    res.send(result.toString()); // convert to string otherwise browser interprets as a status code
  };
  app.get('/lab5/calculator', calculator);
}
