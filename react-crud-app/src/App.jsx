import { useCallback, useState } from 'react';
import SearchForm from './components/SearchForm';
import AddUser from './components/AddUser';
import ResultTable from './components/ResultTable';
import './App.css';

function App() {
  const [keyword, setKeyword] = useState('');
  const [pendingUser, setPendingUser] = useState(null);
  const handleUserAdded = useCallback(() => setPendingUser(null), []);

  return (
    <div className="app-container">
      <section className="toolbar">
        <SearchForm value={keyword} onChangeValue={setKeyword} />
        <AddUser onAdd={setPendingUser} />
      </section>

      <ResultTable keyword={keyword} user={pendingUser} onAdded={handleUserAdded} />
    </div>
  );
}

export default App;
