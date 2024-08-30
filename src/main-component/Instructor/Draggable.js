import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "react-bootstrap";
import { IoPencil } from "react-icons/io5";
import { CiCircleRemove } from "react-icons/ci";
import { useTranslation } from "react-i18next";

const grid = 8;

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: "100%",
});

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle,
});

function Draggable({
  sections,
  handleDragEnd,
  handleOpenCustomModal,
  handleUpdateSection,
  removeItem,
  handleClickedVideo,
  handleClickedUpdateRows,
  selectedVideoId,
  setRowNumber,
  handleUpdateVideo,
  handleClickWatchingVideo,
  setVideoDetail,
  inputRef,
  buttonRef,
  clickDownloadFile,
  handleRemoveFile,
  isEnable,
  setSectionModel,
  setIsEnable,
  setVideoId,
}) {
  const { t, i18n } = useTranslation();
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable-sections">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
            {sections.map((section, index) => (
              <Draggable key={section.sectionId} draggableId={section.sectionId} index={index}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                    <div style={{ padding: "10px", border: "1px solid lightgray", borderRadius: "4px", backgroundColor: "white" }}>
                      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <input defaultValue={section.sectionName} disabled={isEnable} onChange={(e) => setSectionModel({ ...sectionModel, sectionName: e.target.value })} />
                        -
                        <input defaultValue={section.description} onChange={(e) => setSectionModel({ ...sectionModel, description: e.target.value })} disabled={isEnable} />
                        <a onClick={() => setIsEnable(!isEnable)}>
                          <IoPencil />
                        </a>
                        {!isEnable && (
                          <button className="btn btn-success" onClick={() => handleUpdateSection(section.sectionId)}>
                            Update
                          </button>
                        )}
                        <button style={{ marginLeft: "auto" }} onClick={() => removeItem(section.sectionId, "section")} className="btn btn-danger">
                          {t("Remove Section")}
                        </button>
                        <button
                          style={{ marginLeft: "auto" }}
                          data-target={section.sectionId}
                          onClick={() => {
                            setVideoDetail({ publicVideoId: "", sectionId: section.sectionId });
                            handleOpenCustomModal("NewVideo");
                          }}
                          className="btn btn-secondary"
                        >
                          {t("Add Video")}
                        </button>
                      </div>
                      {section.videos.map((video, videoIndex) => (
                        <div key={video.videoId}>
                          <div style={{ marginTop: "10px", padding: "10px", border: "1px solid lightgray", borderRadius: "4px", backgroundColor: "lightgray" }}>
                            <input ref={inputRef} disabled={selectedVideoId !== video.videoId} onChange={(e) => setRowNumber(e.target.value)} defaultValue={video.rowNumberForSection} />
                            <button id={video.videoId} className="btn btn-warning" onClick={() => handleClickedVideo(video.videoId)}>
                              {handleClickedUpdateRows && selectedVideoId === video.videoId ? "Cancel" : "Change Order"}
                            </button>
                            -----
                            {video.title}
                            {handleClickedUpdateRows && selectedVideoId === video.videoId && (
                              <button className="btn btn-success" onClick={() => handleUpdateVideo(video.videoId)}>
                                Save Changes
                              </button>
                            )}
                            <button onClick={() => handleClickWatchingVideo(video.publicVideoId)}>Watch Video</button>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                setVideoDetail({ publicVideoId: video.publicVideoId, sectionId: section.sectionId, rowNumber: video.rowNumberForSection, videoName: video.title });
                                handleOpenCustomModal("ChangeVideo");
                              }}
                            >
                              Change Video
                            </button>
                            <a onClick={() => removeItem(video.publicVideoId, "video")}>
                              <CiCircleRemove color="red">Remove</CiCircleRemove>
                            </a>
                            <hr />
                            <div style={{ position: "relative" }}>
                              {video.materials.length > 0 ? (
                                video.materials.map((material, materialIndex) => (
                                  <div key={materialIndex}>
                                    {material.name}
                                    <button className="btn btn-secondary" onClick={() => clickDownloadFile(material.fileUrl)}>
                                      Download
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleRemoveFile(material.fileUrl)}>
                                      Remove
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <button
                                  className="btn btn-warning"
                                  id="newMaterialButton"
                                  ref={buttonRef}
                                  data-value={video.videoId}
                                  onClick={() => {
                                    handleOpenCustomModal("NewMaterial");
                                    setVideoId(video?.videoId);
                                  }}
                                >
                                  Add Material
                                </button>
                              )}
                            </div>
                            <hr style={{ backgroundColor: "red", height: "5px" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Draggable;
