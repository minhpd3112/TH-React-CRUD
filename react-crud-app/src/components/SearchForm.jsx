import PropTypes from 'prop-types';
import './SearchForm.css';

function SearchForm({ value, onChangeValue }) {
  return (
    <div className="search-form">
      <label htmlFor="search" className="search-label">
        Tìm theo tên hoặc tên đăng nhập
      </label>
      <input
        id="search"
        name="search"
        type="text"
        value={value}
        onChange={(event) => onChangeValue(event.target.value)}
        placeholder="Nhập từ khóa..."
        autoComplete="off"
      />
    </div>
  );
}

SearchForm.propTypes = {
  value: PropTypes.string.isRequired,
  onChangeValue: PropTypes.func.isRequired,
};

export default SearchForm;
