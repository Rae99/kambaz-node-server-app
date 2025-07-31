export function hello(app) {
    app.get('/hello', (req, res) => {
        res.send('Hello World!')
    })
    app.get('/', (req, res) => {
        res.send('Hello from the root route!')
    });
}


