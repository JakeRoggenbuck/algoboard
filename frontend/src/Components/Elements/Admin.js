import { useState } from 'react';

function Admin() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim()) {
      setMessage('Please enter a username');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/admin/create-user', {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('github_token') || '',
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setMessage('User added successfully!');
        setUsername('');
      } else {
        setMessage(data.message || 'Failed to add user');
      }
    } catch (error) {
      setMessage('An error occurred while adding the user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding...' : 'Add User'}
          </button>
        </div>
        {message && (
          <p
            className={`text-sm ${
              message.includes('success') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Admin;
