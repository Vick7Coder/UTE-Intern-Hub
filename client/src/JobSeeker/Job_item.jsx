import { Card, ListGroupItem, ListGroup, Button } from "react-bootstrap";
import classes from "./Modalf.module.css";
// them c vao sau cac classes.c de loai bo css cho code nay.
function Jobitem({ item, jobApply }) {
  const tag = item.title.split(" ")[0].toLowerCase();
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div className={classes.cimages} style={{ marginRight: '20px' }}>
        <Card.Img style={{ objectFit: 'cover', height: '100px', width: "100px", borderRadius: '10px', border: "none", margin: "10px" }}
          variant="top"
          src={`https://source.unsplash.com/276x170?${tag}+computer`}
        />
      </div>

      <div style={{ flex: 1 }}>
        <Card.Body style={{ border: "none", marginBottom: '-12px' }}>
          <Card.Title style={{ border: "none", marginBottom: '-12px' }}>
            <h4>{item.title}</h4>
          </Card.Title>
        </Card.Body>
        <ListGroup className="list-group-flush" style={{ border: "none", display: 'flex', flexDirection: 'column', marginBottom: '-12px' }}>
          <ListGroupItem style={{ border: "none", display: 'flex', marginBottom: '-12px' }}>
            <div style={{ flex: 1 }}>
              <h6>{item.category}</h6>
            </div>
            <div style={{ flex: 1, marginLeft: "-800px" }}>
              <Card.Text className={classes.cdescription}>
                {item.description}
              </Card.Text>
            </div>
          </ListGroupItem>
          <ListGroupItem style={{ border: "none", display: 'flex', marginBottom: '-12px' }}>
            <div className={classes.cdeadlines} style={{ flex: 1 }}>
              <div>Ngày bắt đầu:</div>
              <div className={classes.cdates}>
                <i className="bi bi-calendar2-check"></i>
                <span className="mx-2">{item.startDate}</span>
              </div>
            </div>
            <div className={classes.cdeadlines} style={{ flex: 1, marginLeft: "-800px" }}>
              <div>Ngày kết thúc:</div>
              <div className={classes.cdates}>
                <i className="bi bi-calendar-x"></i>
                <span className="mx-2">{item.startDate}</span>
              </div>
            </div>
          </ListGroupItem>
        </ListGroup>
        <Card.Body style={{ border: "none", marginTop: '5px' }}>
          {!item.status && (
            <Button
              variant="primary"
              onClick={() => {
                jobApply(item);
              }}
            >
              Ứng tuyển ngay
            </Button>
          )}
          {item.status && (
            <Button
              variant={item.status.includes("Applied") ? "secondary" : "success"}
              className={
                item.status === "Shortlisted" ? classes.cshortlistedButton : ""
              }
              disabled={true}
            >
              {item.status === "Shortlisted" ? (
                <span>
                  Shortlisted <i className="bi bi-heart-fill"></i>
                </span>
              ) : (
                item.status
              )}
            </Button>
          )}
        </Card.Body>
      </div>
    </div>
  );
}

export default Jobitem;
