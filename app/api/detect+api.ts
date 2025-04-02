import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  const formData = await req.formData();

  const leafType = formData.get("leafType") as string;
  const base64Image = formData.get("image") as string;
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

  const imageBuffer = Buffer.from(base64Data, "base64");

  if (leafType === "banana") {
    const imagePath = "python/uploads/banana.jpg";
    fs.writeFileSync(imagePath, imageBuffer);
    const { stdout, stderr } = await execAsync(
      `py -3.12 python/banana.py ${imagePath}`
    );
    console.log("Python script output:", stdout);
    console.error("Python script error:", stderr);
    const res = stdout.trim().split("\n").pop();

    // Fertilizer and remedies for banana diseases
    const fertilizers = {
      cordana: ["Balanced NPK fertilizer", "Phosphorus-rich fertilizer"],
      sigatoka: ["Potassium nitrate", "Organic compost"],
      pestalotiopsis: ["Copper fungicide", "Sulfur-based fertilizers"],
      healthy: ["No fertilizer needed"],
    };

    const remedies = {
      cordana: ["Prune infected leaves", "Apply fungicide containing Mancozeb"],
      sigatoka: ["Use resistant banana varieties", "Improve air circulation"],
      pestalotiopsis: ["Avoid excessive moisture", "Use copper-based sprays"],
      healthy: ["Maintain proper watering and sunlight"],
    };

    return Response.json({
      message: "Image uploaded successfully",
      prediction: res,
      fertilizers: fertilizers[res],
      remedies: remedies[res],
    });
  } else {
    const imagePath = "python/uploads/coffee.jpg";
    fs.writeFileSync(imagePath, imageBuffer);
    const { stdout, stderr } = await execAsync(
      `py -3.12 python/coffee.py ${imagePath}`
    );
    console.log("Python script output:", stdout);
    console.error("Python script error:", stderr);
    const res = stdout.trim().split("\n").pop();

    const fertilizers = {
      miner: ["Nitrogen-based fertilizer", "Potassium sulfate"],
      nodisease: ["No fertilizer needed"],
      phoma: ["Copper-based fungicides", "Bordeaux mixture"],
      rust: ["Sulfur-based fungicides", "Fungicide with Mancozeb"],
    };

    const remedies = {
      miner: ["Remove affected leaves", "Use neem oil spray"],
      nodisease: ["Maintain proper watering and sunlight"],
      phoma: ["Apply fungicides regularly", "Ensure proper air circulation"],
      rust: ["Destroy infected plant parts", "Improve plant ventilation"],
    };

    return Response.json({
      message: "Image uploaded successfully",
      prediction: res,
      fertilizers: fertilizers[res],
      remedies: remedies[res],
    });
  }
}
