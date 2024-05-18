const Username = ({ username, onClick, selected }) => {
  const onClickHandler = () => {
    onClick(username);
  };
  return (
    <div
      role="button"
      onClick={onClickHandler}
      className={selected ? `bg-primary` : ``}
    >
      <i className="bi bi-person-circle"></i>
      <span className="ms-2">{username}</span>
    </div>
  );
};

export default Username;
