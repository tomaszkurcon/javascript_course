exports.postLogin = (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "password") {
    res.status(200).json({ token: btoa("admin:password") });
  } else {
    res.status(401).json({ error: "Niepoprawne dane logowania" });
  }
};
