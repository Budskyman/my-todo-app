const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let todos = [];  // Pastikan array todos dimulai kosong

// Format tanggal agar lebih mudah dibaca
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  };
  return date.toLocaleString('id-ID', options); // Menggunakan format Indonesia
}

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Express route untuk menampilkan halaman
app.get("/", (req, res) => {
  // Jangan masukkan tugas default
  res.render("index", { todos });  // Mengirimkan todos yang sudah ada
});

// Menambahkan tugas baru
app.post('/add', (req, res) => {
  const task = req.body.todo;
  const dueDate = req.body.dueDate;

  console.log('Tugas diterima:', task);
  console.log('Tanggal diterima:', dueDate);

  if (task && dueDate) {
    const formattedDate = new Date(dueDate).toISOString();  // Format ISO yang valid
    todos.push({ text: task, dueDate: formattedDate, notified: false });
    console.log('Todos setelah ditambah:', todos); // Pastikan hanya tugas baru yang ditambahkan
  }

  res.redirect('/');
});

// Menghapus tugas
app.post('/delete', (req, res) => {
  const index = parseInt(req.body.index);
  if (!isNaN(index)) {
    todos.splice(index, 1);
    console.log('Todos setelah dihapus:', todos); // Pastikan tugas dihapus dengan benar
  }
  res.redirect('/');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
