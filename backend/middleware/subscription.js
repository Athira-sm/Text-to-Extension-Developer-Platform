function checkSubscription(req, res, next) {
  const plan = req.headers["x-user-plan"] || "free";

  const prompt = req.body.prompt || "";

  if (!plan.includes("pro") && prompt.toLowerCase().includes("api")) {
    return res.status(403).json({
      message: "Upgrade to PRO for API-based extensions",
    });
  }

  next();
}

module.exports = checkSubscription;