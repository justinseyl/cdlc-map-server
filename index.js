const app = require('express')();
const path = require('path');
const port = 3000;

app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');
app.set('view options', { layout: '/layouts/user-main' });

app.get('/',(req,res) => {
  res.render('user-index');
});

app.set('port', process.env.PORT || port);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
