import html2canvas from "html2canvas";
import { useRef, useState } from "react";
import "./App.scss";

const App = () => {
  const [form, setForm] = useState({
    file: null,
    pointerColor: "#ffc107",
    fontSize: 16,
  });
  const [comments, setComments] = useState([]);
  const photoFile = useRef(null);
  const screenshot = useRef(null);
  const main = useRef(null);
  const cardWidth = 250;
  const cardHeight = 80;

  const handleAddImage = (e) => {
    const image = photoFile.current.files[0];
    const reader = new FileReader();
    setComments([]);
    reader.readAsDataURL(image);
    reader.onload = () => {
      form.file = reader.result;
      setForm({ ...form });
    };
  };

  const handleChangeColor = (e) => {
    const { value } = e.currentTarget;
    form.pointerColor = value;
    setForm({ ...form });
  };

  const handleFontSize = (e) => {
    const { value } = e.currentTarget;
    form.fontSize = value;
    setForm({ ...form });
  };

  const handlePopUpComment = (e) => {
    const { pageX, pageY } = e;
    const { height, width } = screenshot.current;
    const id = comments[comments.length - 1]?.id || 1;
    const newId = id + 1;
    let cardX = pageX - main.current.offsetLeft + 10;
    let cardY = pageY - 70;
    const poinX = pageX - main.current.offsetLeft - 10;
    const poinY = pageY - 90;
    if (width < cardX + cardWidth) {
      cardX -= cardWidth + 16;
    }
    if (height < cardY + cardHeight) {
      cardY -= cardHeight + 16;
    }
    comments.push({
      id: newId,
      cardX: cardX,
      cardY: cardY,
      poinX: poinX,
      poinY: poinY,
    });
    setComments([...comments]);
    setTimeout(() => {
      document.getElementById(`comment-${newId}`).focus();
    }, 100);
  };

  const handleFormComment = (e) => {
    e.stopPropagation();
  };

  const handleCloseAComment = (id) => {
    setComments([...comments.filter((comment) => comment.id !== id)]);
  };

  const handleTextAreaSize = (e) => {
    const { id, scrollHeight } = e.currentTarget;
    const textArea = document.getElementById(id);
    textArea.style.height = `${scrollHeight}px`;
    textArea.style.overflow = "hidden";
  };

  const handleSave = (e) => {
    const btnClose = document.getElementsByClassName("btn-close");
    const textComment = document.getElementsByClassName("text-comment");

    for (let index = 0; index < btnClose.length; index++) {
      const element = btnClose[index];
      element.remove();
    }
    for (let index = 0; index < textComment.length; index++) {
      const element = textComment[index];
      element.style.display = "none";
      const view = document.getElementById(`${element.id}-view`);
      view.innerText = element.value;
      view.style.display = "block";
    }

    html2canvas(main.current).then((canvas) => {
      const img = canvas.toDataURL("image/png");
      document.body.innerHTML = `<div style="margin: 50px; width: 1000px; margin-left: auto; margin-right: auto"><p>Copy or save the image below. <a href="/">Create new</a></p><img style="width: 1000px" src="${img}"/></div>`;
    });
  };

  document.addEventListener("paste", function (evt) {
    const clipboardItems = evt.clipboardData.items;
    const items = [].slice.call(clipboardItems).filter(function (item) {
      return item.type.indexOf("image") !== -1;
    });
    if (items.length === 0) {
      return;
    }

    const item = items[0];
    const image = item.getAsFile();
    const reader = new FileReader();
    setComments([]);
    reader.readAsDataURL(image);
    reader.onload = () => {
      form.file = reader.result;
      setForm({ ...form });
    };
  });

  return (
    <div style={{ margin: "80px 50px" }}>
      <div className="fixed-top d-flex justify-content-center">
        <div
          className="d-flex bg-white rounded-pill px-5 bg-opacity-75 mx-auto shadow-sm"
          style={{ height: "60px", marginTop: "10px" }}>
          <div className="me-3 d-flex align-items-center">
            <img
              src="/logo192.png"
              alt="qss-comments"
              className="img-fluid me-3"
              style={{ height: "40px" }}
            />
            <input
              ref={photoFile}
              type="file"
              className="form-control"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleAddImage}
            />
          </div>
          <div className="me-3 d-flex align-items-center">
            <code className="border rounded py-1 px-2 text-black me-1">
              Ctrl
            </code>{" "}
            +{" "}
            <code className="border rounded py-1 px-2 text-black mx-1">V</code>{" "}
            in this window
          </div>
          <div className="me-3 d-flex align-items-center">
            <input
              onChange={handleChangeColor}
              type="color"
              className="form-control form-control-color"
              title="Pointer color"
              value={form.pointerColor}
            />
          </div>
          <div className="me-3 d-flex align-items-center">
            <select
              className="form-select"
              onChange={handleFontSize}
              defaultValue={form.formSize}>
              <option value="12">Font small</option>
              <option value="16">Font medium</option>
              <option value="24">Font large</option>
            </select>
          </div>
          <div className="d-flex align-items-center">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSave}>
              Show Result
            </button>
          </div>
        </div>
      </div>
      <div
        ref={main}
        className="position-relative rounded mx-auto"
        style={{ width: "1000px" }}>
        {form.file && (
          <>
            <img
              ref={screenshot}
              src={form.file}
              className={`rounded img-fluid shadow-sm`}
              alt="Screenshot"
              style={{ width: "1000px" }}
            />
            <div
              className="position-absolute w-100 top-0 start-0"
              style={{ height: "100%" }}
              onClick={handlePopUpComment}>
              {comments.map((comment) => (
                <div className="position-relative" key={comment.id}>
                  <div
                    className="position-absolute rounded-circle opacity-50"
                    style={{
                      backgroundColor: form.pointerColor,
                      width: "25px",
                      height: "25px",
                      top: comment.poinY,
                      left: comment.poinX,
                    }}
                  />
                  <div
                    className="position-absolute rounded-circle"
                    style={{
                      backgroundColor: form.pointerColor,
                      width: "15px",
                      height: "15px",
                      top: comment.poinY + 5,
                      left: comment.poinX + 5,
                    }}
                  />
                  <div
                    className="card position-absolute bg-white bg-opacity-75"
                    onClick={handleFormComment}
                    style={{
                      width: `${cardWidth}px`,
                      top: comment.cardY,
                      left: comment.cardX,
                    }}>
                    <div className="card-body position-relative p-0 ">
                      <button
                        onClick={(e) => handleCloseAComment(comment.id)}
                        type="button"
                        className="btn-close shadow-none position-absolute top-0 end-0 opacity-50"
                        style={{ transform: "scale(0.7)" }}
                      />
                      <div
                        id={`comment-${comment.id}-view`}
                        style={{
                          height: `${cardHeight}px`,
                          fontSize: `${form.fontSize}px`,
                          display: "none",
                        }}
                        className="form-control bg-transparent border-0 p-3 fw-bold"></div>
                      <textarea
                        id={`comment-${comment.id}`}
                        onChange={handleTextAreaSize}
                        style={{
                          height: `${cardHeight}px`,
                          fontSize: `${form.fontSize}px`,
                        }}
                        name="comment"
                        className="text-comment form-control border-0 p-3 shadow-none bg-transparent fw-bold"
                        placeholder="Add a comment"></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
