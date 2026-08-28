import { useState } from "react";
import { Container, Row, Col, Form, Table, Navbar, Button, Card, Badge } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !course || !email || !address) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`);
      const data = await response.json();

      if (data.length === 0) {
        alert("Address not found. Please try a different address.");
        return;
      }

      const result = data[0];
      
      const newStudent = {
        id: Date.now(),
        firstName,
        lastName,
        course,
        email,
        originalAddress: address,
        latitude: Number(result.lat),
        longitude: Number(result.lon),
      };

      setStudents(prev => [...prev, newStudent]);

      setFirstName("");
      setLastName("");
      setCourse("");
      setEmail("");
      setAddress("");
    } catch (error) {
      console.error(error);
      alert("Something went wong while fetching the location.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const primaryPink = "#d6336c";
  const lightPink = "#fce8ef";
  const borderMuted = "#dee2e6";

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", color: "#212529", fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>
      
      <Navbar bg="white" className="px-4 py-3 border-bottom" style={{ borderColor: borderMuted }}>
        <Container fluid>
          <Navbar.Brand className="fw-bold" style={{ letterSpacing: "1px", color: "#212529", display: "flex", gap: "12px", alignItems: "center", margin: 0 }}>
            <div style={{ width: "6px", height: "34px", backgroundColor: primaryPink, borderRadius: "4px" }}></div>
            <div>
              STUDENT LOCATION SYSTEM
              <div className="text-muted" style={{ fontSize: "12px", letterSpacing: "normal", fontWeight: "normal", textTransform: "none", margin: 0 }}>Register students and their locations</div>
            </div>
          </Navbar.Brand>
          <Navbar.Text className="fw-bold border p-2 rounded" style={{ borderColor: borderMuted, backgroundColor: "#f8f9fa", color: "#6c757d", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Total Student: <span className="ms-2" style={{ color: primaryPink, fontSize: "16px" }}>{students.length}</span>
          </Navbar.Text>
        </Container>
      </Navbar>

      <div className="text-center py-4" style={{ backgroundColor: "#ffffff", borderBottom: `1px solid ${borderMuted}` }}>
  <h2 className="fw-bold text-uppercase mb-0" style={{ color: "#212529", letterSpacing: "1px" }}>Student Locations</h2>
</div>

      <Container fluid className="px-4 py-5">
        <Row className="g-4">
          
          <Col lg={7}>
            <Card className="h-100 rounded bg-white shadow-sm" style={{ border: `1px solid ${borderMuted}` }}>
              <Card.Header className="fw-bold text-uppercase border-bottom py-3 bg-white" style={{ borderColor: borderMuted, color: "#212529", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>Student Location</div>
                 <span className="badge mb-2 px-3 py-2 text-uppercase" style={{ color: "#850440", letterSpacing: "1px" }}>
                  FIDELIS MAY MAGLAQUE - INF232
                </span>
              </Card.Header>
              <Card.Body className="p-3">
                <div style={{ border: `1px solid ${borderMuted}`, height: "400px", borderRadius: "6px", overflow: "hidden" }}>
                  <MapContainer center={[14.5995, 121.033]} zoom={11} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                      attribution='&copy; OpenStreetMap contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {students.map((student) => (
                      <Marker key={student.id} position={[student.latitude, student.longitude]}>
                        <Popup>
                          <div className="text-dark">
                            <h6 className="fw-bold text-uppercase mb-1">{student.firstName} {student.lastName}</h6>
                            <span className="fw-bold text-uppercase mb-2 d-inline-block px-2 py-1 rounded" style={{ fontSize: "10px", letterSpacing: "1px", backgroundColor: lightPink, color: primaryPink }}>{student.course}</span>
                            <p className="mb-1 text-muted" style={{ fontSize: "12px" }}><strong className="text-dark">Email:</strong> {student.email}</p>
                            <p className="mb-1 text-muted" style={{ fontSize: "12px" }}><strong className="text-dark">Address:</strong> {student.originalAddress}</p>
                            <p className="mb-0 text-muted" style={{ fontSize: "12px" }}><strong className="text-dark">Coordinates:</strong> {student.latitude.toFixed(4)}, {student.longitude.toFixed(4)}</p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5}>
            <Card className="rounded bg-white shadow-sm" style={{ border: `1px solid ${borderMuted}` }}>
              <Card.Header className="fw-bold text-uppercase border-bottom py-3 bg-white" style={{ borderColor: borderMuted, color: "#212529" }}>
                Student Registration
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="text-uppercase text-secondary fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Firstname</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter First Name" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      className="rounded"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-uppercase text-secondary fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Lastname</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter Last Name" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      className="rounded"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-uppercase text-secondary fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Course</Form.Label>
                    <Form.Select 
                      value={course} 
                      onChange={(e) => setCourse(e.target.value)}
                      className="rounded"
                    >
                      <option value="">Select Course</option>
                      <option value="BSCS">BSCS</option>
                      <option value="BSIT">BSIT</option>
                      <option value="BSIS">BSIS</option>
                      <option value="BSCpE">BSCpE</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-uppercase text-secondary fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      placeholder="e.g., student@gmail.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="rounded"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="text-uppercase text-secondary fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Address</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      placeholder="e.g., Makati City, Philippines" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      className="rounded"
                    />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-100 py-3 fw-bold text-uppercase border-0 rounded"
                    style={{ letterSpacing: "1px", backgroundColor: primaryPink, fontSize: "14px" }}
                  >
                    {loading ? "Transmitting..." : "Initialize Registration"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <Card className="rounded bg-white shadow-sm" style={{ border: `1px solid ${borderMuted}` }}>
              <Card.Header className="fw-bold text-uppercase border-bottom py-3 bg-white" style={{ borderColor: borderMuted, color: "#212529" }}>
                Registered Roster
              </Card.Header>
              <Card.Body className="p-0">
                <Table hover responsive className="m-0 align-middle bg-white">
                  <thead style={{ borderBottom: `2px solid ${borderMuted}`, backgroundColor: "#f8f9fa" }}>
                    <tr className="text-uppercase text-secondary" style={{ fontSize: "12px", letterSpacing: "1px" }}>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3">Student</th>
                      <th className="py-3 text-center">Course</th>
                      <th className="py-3 text-center">Email</th>
                      <th className="py-3 text-center">Address</th>
                      <th className="py-3 text-center">Coordinates</th>
                      <th className="py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-5 text-secondary text-uppercase fw-bold" style={{ fontSize: "13px" }}>No Personnel Found in Database</td>
                      </tr>
                    ) : (
                      students.map((student, index) => (
                        <tr key={student.id} style={{ borderColor: borderMuted }}>
                          <td className="px-4 py-3 fw-bold text-secondary">{index + 1}</td>
                          <td className="py-3 fw-bold text-uppercase" style={{ color: "#212529", fontSize: "14px" }}>{student.firstName} {student.lastName}</td>
                          <td className="py-3 text-center">
                            <span className="badge text-uppercase px-2 py-1" style={{ backgroundColor: lightPink, color: primaryPink, letterSpacing: "0.5px" }}>{student.course}</span>
                          </td>
                          <td className="py-3 text-center text-secondary" style={{ fontSize: "14px" }}>{student.email}</td>
                          <td className="py-3 text-center text-secondary" style={{ fontSize: "14px" }}>{student.originalAddress}</td>
                          <td className="py-3 text-center text-secondary" style={{ fontFamily: "monospace", fontSize: "12px" }}>
                            <div>LAT: {student.latitude.toFixed(5)}</div>
                            <div>LNG: {student.longitude.toFixed(5)}</div>
                          </td>
                          <td className="py-3 text-center">
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              className="fw-bold text-uppercase rounded"
                              style={{ fontSize: "11px", letterSpacing: "1px", color: primaryPink, borderColor: primaryPink }}
                              onClick={() => handleDelete(student.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;