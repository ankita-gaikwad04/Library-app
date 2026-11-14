import React, { useState } from 'react';
import { api } from '../api';

export default function StudentPortal() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const API_BASE = 'https://library-app-1-rsp4.onrender.com/api';

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/members/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!res.ok) throw new Error("User not found");
      
      const userData = await res.json();
      setUser(userData);
      
      const booksData = await api.getBooks();
      if (Array.isArray(booksData)) {
        setBooks(booksData);
        setSearchResults(booksData);
      }
      
    } catch (err) {
      alert("Login failed. Check your email.");
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault(); 
    if (!searchQuery.trim()) {
      setSearchResults(books); 
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`${API_BASE}/books/rag-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      if (Array.isArray(data)) setSearchResults(data);
    } catch (err) {
      console.error("RAG search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  // NEW: Function to handle the book request
  const handleRequestBook = async (bookId) => {
    try {
      const res = await fetch(`${API_BASE}/borrow/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_id: bookId, member_id: user.member_id })
      });

      if (res.ok) {
        alert("✅ Request sent to librarian! Please wait for approval.");
      } else {
        alert("❌ Failed to send request.");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending request.");
    }
  };

  if (!user) {
    return (
      <div style={{ maxWidth: '400px', margin: '80px auto', textAlign: 'center' }}>
        <div className="page-header"><h1>Student Login</h1><p>Enter your email to access the portal.</p></div>
        <div className="form-card">
          <input type="email" placeholder="Enter your email..." value={email} onChange={e => setEmail(e.target.value)} />
          <button className="btn-primary" onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Welcome, {user.name} 👋</h1>
        <p>Search the catalog and request books to borrow.</p>
      </div>

      <form onSubmit={handleSearchSubmit} className="form-card" style={{ display: 'flex', gap: '16px' }}>
        <input 
          type="text" 
          placeholder="Try asking: 'I want to prepare for a coding interview'..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          style={{ marginBottom: 0 }} 
        />
        <button type="submit" className="btn-primary" style={{ width: '150px' }} disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="grid-container">
        {searchResults.length > 0 ? (
          searchResults.map(b => (
            <div key={b.book_id} className="card">
              <h4>{b.book_name}</h4>
              <p>By {b.author}</p>
              
              {b.description && (
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '10px', fontStyle: 'italic' }}>
                  "{b.description}"
                </p>
              )}
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px' }}>
                <span className="badge badge-available">Available ({b.quantity})</span>
                
                {/* NEW: Request Button */}
                <button 
                  className="btn-primary" 
                  style={{ width: 'auto', padding: '8px 16px', fontSize: '0.85rem' }}
                  onClick={() => handleRequestBook(b.book_id)}
                  disabled={b.quantity <= 0}
                >
                  Request
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#64748b', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            No books found matching "{searchQuery}"
          </p>
        )}
      </div>
    </div>
  );
}