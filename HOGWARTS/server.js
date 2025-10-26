// server.js - Node.js სერვერი Express-ით და Socket.IO-თი

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
// ✅ ახალი: Node.js-ის ფაილური სისტემის მოდული მონაცემთა შესანახად
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); 

const PORT = process.env.PORT || 3000;
const NEWS_FILE = path.join(__dirname, 'gryffindor_news.json'); // ✅ ფაილი მონაცემების შესანახად

// ✅ Express-ის შუალედური პროგრამა (Middleware) JSON-ის გასაანალიზებლად
app.use(express.json());

// 1. სტატიკური ფაილების სერვირება (HOGWARTS/ საქაღალდე)
app.use(express.static(__dirname)); 

// =========================================================
// ✅ ახალი: მონაცემთა მართვის ფუნქციები
// =========================================================

// სიახლეების წაკითხვა ფაილიდან
function readNews() {
    try {
        if (!fs.existsSync(NEWS_FILE)) {
            // თუ ფაილი არ არსებობს, შექმენი ცარიელი მასივი
            fs.writeFileSync(NEWS_FILE, JSON.stringify([]));
            return [];
        }
        const data = fs.readFileSync(NEWS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading news file:', error);
        return [];
    }
}

// სიახლეების ჩაწერა ფაილში
function writeNews(news) {
    try {
        fs.writeFileSync(NEWS_FILE, JSON.stringify(news, null, 2));
    } catch (error) {
        console.error('Error writing news file:', error);
    }
}

// =========================================================
// ✅ ახალი: API ენდპოინტები სიახლეებისთვის
// =========================================================

// GET /api/news: ყველა სიახლის მიღება
app.get('/api/news', (req, res) => {
    const news = readNews().reverse(); // ბოლო დამატებული პირველი გამოჩნდეს
    res.json(news);
});

// POST /api/news: სიახლის დამატება (მოგვიანებით დავამატებთ ადმინისტრატორის შემოწმებას)
app.post('/api/news', (req, res) => {
    const { title, content, user } = req.body;
    
    // ✅ მარტივი ვალიდაცია
    if (!title || !content || !user) {
        return res.status(400).json({ success: false, message: 'სათაური და ტექსტი აუცილებელია.' });
    }

    const news = readNews();
    const newId = Date.now().toString(); // უნიკალური ID დროის მიხედვით
    
    const newPost = {
        id: newId,
        title,
        content,
        user, // ვინც ატვირთა
        timestamp: new Date().toISOString()
    };
    
    news.push(newPost);
    writeNews(news);
    
    // ✅ ახალი სიახლის გაგზავნა ყველა კლიენტზე Socket.IO-ს გამოყენებით
    io.to('gryffindor_chat').emit('newNewsPost', newPost);
    
    res.status(201).json({ success: true, post: newPost });
});
// ... (არსებული app.post('/api/news', ...) ბლოკის შემდეგ) ...

// DELETE /api/news/:id: სიახლის წაშლა
app.delete('/api/news/:id', (req, res) => {
    const postId = req.params.id;
    let news = readNews();
    
    const initialLength = news.length;
    
    // გაფილტვრა: დატოვეთ მხოლოდ ის პოსტები, რომელთა ID არ ემთხვევა წასაშლელ ID-ს
    news = news.filter(post => post.id !== postId);
    
    if (news.length < initialLength) {
        writeNews(news);
        
        // ✅ Socket.IO-თი შეტყობინების გაგზავნა ყველა კლიენტზე, რომ პოსტი წაიშალა
        io.to('gryffindor_chat').emit('deleteNewsPost', { id: postId });
        
        return res.json({ success: true, message: `Post ${postId} deleted.` });
    } else {
        return res.status(404).json({ success: false, message: 'Post not found.' });
    }
});

// ... (Socket.IO კავშირების ლოგიკა) ...

// =========================================================
// 2. Socket.IO კავშირების ლოგიკა (უცვლელი)
// =========================================================

io.on('connection', (socket) => {
  console.log('✅ ახალი მომხმარებელი შემოუერთდა ჩატს');
  
  const room = 'gryffindor_chat';
  socket.join(room);

  socket.on('chatMessage', (msg) => {
    io.to(room).emit('chatMessage', msg); 
  });

  socket.on('disconnect', () => {
    console.log('❌ მომხმარებელმა დატოვა ჩათი');
  });
});

// 3. სერვერის გაშვება
server.listen(PORT, () => {
  console.log(`🚀 სერვერი მუშაობს: http://localhost:${PORT}/index.html`);
});
