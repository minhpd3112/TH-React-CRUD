import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import './AddUser.css';

const createEmptyUser = () => ({
  name: '',
  username: '',
  email: '',
  phone: '',
  website: '',
  address: {
    street: '',
    suite: '',
    city: '',
  },
});

function AddUser({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState(createEmptyUser);
  const [errors, setErrors] = useState({});

  const validationMessages = useMemo(
    () => ({
      name: 'Vui lòng nhập tên.',
      username: 'Vui lòng nhập username.',
      email: 'Email không hợp lệ.',
      phone: 'Số điện thoại không hợp lệ.',
      website: 'Website không hợp lệ.',
    }),
    []
  );

  const resetForm = () => {
    setFormState(createEmptyUser());
    setErrors({});
  };

  const handleOpen = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    if (['street', 'suite', 'city'].includes(id)) {
      setFormState((prev) => ({
        ...prev,
        address: { ...prev.address, [id]: value },
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formState.name.trim()) newErrors.name = validationMessages.name;
    if (!formState.username.trim()) newErrors.username = validationMessages.username;

    if (formState.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(formState.email)) {
      newErrors.email = validationMessages.email;
    }

    if (formState.phone && !/^[\d\s()+-]{6,}$/i.test(formState.phone)) {
      newErrors.phone = validationMessages.phone;
    }

    if (formState.website && !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}.*$/i.test(formState.website)) {
      newErrors.website = validationMessages.website;
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const validationResult = validate();
    if (Object.keys(validationResult).length) {
      setErrors(validationResult);
      return;
    }

    const trimmedUser = {
      ...formState,
      name: formState.name.trim(),
      username: formState.username.trim(),
      email: formState.email.trim(),
      phone: formState.phone.trim(),
      website: formState.website.trim(),
      address: {
        street: formState.address.street.trim(),
        suite: formState.address.suite.trim(),
        city: formState.address.city.trim(),
      },
    };

    onAdd(trimmedUser);
    resetForm();
    setIsOpen(false);
  };

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={handleOpen}>
        Thêm người dùng
      </button>
      {isOpen && (
        <Modal title="Thêm người dùng" onClose={handleClose} onSubmit={handleSubmit} submitLabel="Thêm">
          <div className="form-grid">
            <div className="form-control">
              <label htmlFor="name">
                Họ tên <span className="required">*</span>
              </label>
              <input id="name" value={formState.name} onChange={handleChange} />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>
            <div className="form-control">
              <label htmlFor="username">
                Tên đăng nhập <span className="required">*</span>
              </label>
              <input id="username" value={formState.username} onChange={handleChange} />
              {errors.username && <p className="error">{errors.username}</p>}
            </div>
            <div className="form-control">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={formState.email} onChange={handleChange} />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="form-control">
              <label htmlFor="phone">Số điện thoại</label>
              <input id="phone" value={formState.phone} onChange={handleChange} />
              {errors.phone && <p className="error">{errors.phone}</p>}
            </div>
            <div className="form-control">
              <label htmlFor="website">Website</label>
              <input id="website" value={formState.website} onChange={handleChange} />
              {errors.website && <p className="error">{errors.website}</p>}
            </div>
            <div className="form-control span-2">
              <label>Địa chỉ</label>
              <div className="address-grid">
                <input
                  id="street"
                  placeholder="Đường"
                  value={formState.address.street}
                  onChange={handleChange}
                />
                <input
                  id="suite"
                  placeholder="Phường / Ấp"
                  value={formState.address.suite}
                  onChange={handleChange}
                />
                <input
                  id="city"
                  placeholder="Thành phố"
                  value={formState.address.city}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

AddUser.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export default AddUser;
