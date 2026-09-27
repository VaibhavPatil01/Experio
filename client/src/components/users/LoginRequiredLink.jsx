import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/store.js';

function LoginRequiredLink({ textContent, to, className, openModal, state }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userState = useAppSelector((state) => state.userState);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModalLocal = () => {
    if (openModal) {
      openModal(to);
    }
    setIsModalOpen(true);
  };

  const handleNonLoggedInUserClick = (event) => {
    if (!userState.isLoggedIn) {
      event.preventDefault();
      openModalLocal();
    }
  };

  return (
    <>
      <Link to={to} state={state} className={className} onClick={handleNonLoggedInUserClick}>
        {textContent}
      </Link>
    </>
  );
}

export default LoginRequiredLink;
