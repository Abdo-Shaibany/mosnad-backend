import "colors";

const logger = (req: any, res: any, next: any) => {
  const methodColors: { [key: string]: string } = {
    GET: "green",
    POST: "blue",
    PUT: "yellow",
    DELETE: "red",
  };

  const color: any = methodColors[req.method] || "white";

  console.log(
    `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`[
      color
    ]
  );

  next();
};

export default logger;
