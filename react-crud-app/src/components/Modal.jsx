import PropTypes from 'prop-types';
import './Modal.css';

function Modal({ title, children, onClose, onSubmit, submitLabel = 'Lưu' }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <header className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Đóng">
            ×
          </button>
        </header>
        <div className="modal-body">{children}</div>
        <footer className="modal-footer">
          <button type="button" className="btn" onClick={onClose}>
            Hủy
          </button>
          <button type="button" className="btn btn-primary" onClick={onSubmit}>
            {submitLabel}
          </button>
        </footer>
      </div>
    </div>
  );
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
};

export default Modal;
