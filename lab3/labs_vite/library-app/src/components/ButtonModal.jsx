import { useState } from "react";

const ButtonModal = ({
  id,
  className,
  title,
  withForm = true,
  disabled = false,
  onSubmit = () => {},
  onClickShowData = () => {},
}) => {
  const [data, setData] = useState(null);
  const onSubmitHandler = (ev) => {
    ev.preventDefault();
    console.log(ev.target.elements.username.value);
    onSubmit(ev.target.elements.username.value);
  };
  const onClickHandler = () => {
    async function fetchData() {
      if (onClickShowData) {
        const response = await onClickShowData();
        setData(response);
      }
    }
    fetchData();
  };
  return (
    <>
      <button
        type="button"
        className={`btn btn-primary ${className}`}
        data-bs-toggle="modal"
        data-bs-target={`#${id}`}
        onClick={onClickHandler}
        disabled={disabled}
      >
        {title}
      </button>
      <div
        className="modal fade"
        id={id}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {withForm ? (
                <form id={`form-${id}`} onSubmit={onSubmitHandler}>
                  <label htmlFor="username" className="form-label">
                    Nazwa użytkownika
                  </label>
                  <input id="username" type="text" className="form-control" />
                </form>
              ) : data?.length ? (
                data?.map((item, index) => <p key={index}>{item.username}</p>)
              ) : (
                <div>Brak danych</div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Zamknij
              </button>
              {withForm && (
                <button
                  type="submit"
                  form={`form-${id}`}
                  className="btn btn-primary"
                >
                  Akceptuj
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ButtonModal;
