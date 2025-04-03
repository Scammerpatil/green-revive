import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  const formData = await req.formData();
  const leafType = formData.get("leafType") as string;
  const base64Image = formData.get("image") as string;
  const imageBuffer = Buffer.from(base64Image, "base64");

  if (leafType === "banana") {
    const imagePath = "python/uploads/banana.jpg";
    fs.writeFileSync(imagePath, imageBuffer);
    const { stdout, stderr } = await execAsync(
      `py -3.10 python/banana.py ${imagePath}`
    );
    console.log(stdout.trim().split("\n").pop());
    if (
      stdout.trim().split("\n").pop()?.includes("No Leaf Detected in the Image")
    ) {
      return Response.json({ message: "No Leaf Detected" }, { status: 401 });
    }
    const res = JSON.parse(stdout.trim().split("\n").pop()!);

    const prediciton = res.predicted_label as
      | "boron"
      | "calcium"
      | "healthy"
      | "iron"
      | "magnesium"
      | "manganese"
      | "potassium"
      | "sulphur"
      | "zinc";

    const fertilizers = {
      boron: ["Boron fertilizer", "Soluble boron compounds"],
      calcium: ["Calcium nitrate", "Lime (Calcium carbonate)"],
      healthy: ["No fertilizer needed"],
      iron: ["Iron chelate", "Iron sulfate"],
      magnesium: ["Magnesium sulfate", "Dolomitic lime"],
      manganese: ["Manganese sulfate", "Manganese chelate"],
      potassium: ["Potassium nitrate", "Potassium sulfate"],
      sulphur: ["Elemental sulfur", "Gypsum"],
      zinc: ["Zinc sulfate", "Zinc chelate"],
    };

    const remedies = {
      boron: [
        "Correct boron deficiency with borax application",
        "Prune affected parts",
      ],
      calcium: [
        "Ensure proper calcium availability",
        "Apply calcium foliar spray",
      ],
      healthy: ["Maintain proper watering and sunlight"],
      iron: [
        "Treat iron deficiency with foliar iron spray",
        "Improve soil drainage",
      ],
      magnesium: [
        "Apply magnesium sulfate (Epsom salt)",
        "Ensure proper soil pH",
      ],
      manganese: [
        "Add manganese sulfate to the soil",
        "Ensure proper soil aeration",
      ],
      potassium: [
        "Improve potassium uptake by adding compost",
        "Use potassium-rich fertilizers",
      ],
      sulphur: [
        "Apply elemental sulfur to lower pH",
        "Use sulfur-based fungicides",
      ],
      zinc: [
        "Add zinc sulfate to correct zinc deficiency",
        "Use zinc chelate in soil or foliar sprays",
      ],
    };

    return Response.json({
      message: "Image uploaded successfully",
      prediction: res,
      confidience: res.confidence,
      fertilizers: fertilizers[prediciton],
      remedies: remedies[prediciton],
    });
  } else {
    const imagePath = "python/uploads/coffee.jpg";
    fs.writeFileSync(imagePath, imageBuffer);
    const { stdout, stderr } = await execAsync(
      `py -3.8 python/coffee.py ${imagePath}`
    );
    if (
      stdout.trim().split("\n").pop()?.includes("No Leaf Detected in the Image")
    ) {
      return Response.json({ message: "No Leaf Detected" }, { status: 401 });
    }
    const res = JSON.parse(stdout.trim().split("\n").pop()!);
    const prediciton = res.predicted_label as
      | "iron"
      | "boron"
      | "calcium"
      | "healthy"
      | "magnesium"
      | "manganese"
      | "nitrogen"
      | "phosphorus"
      | "potassium";
    const confidence = res.confidence;
    const fertilizers = {
      boron: ["Boron-based fertilizer", "Boron-rich soil amendments"],
      calcium: ["Calcium nitrate", "Calcium sulfate for soil enrichment"],
      healthy: ["Balanced all-purpose fertilizer", "Organic compost mix"],
      iron: ["Iron chelate", "Iron sulfate for chlorosis prevention"],
      magnesium: [
        "Magnesium sulfate (Epsom salts)",
        "Magnesium-rich organic fertilizer",
      ],
      manganese: [
        "Manganese sulfate",
        "Manganese-enriched fertilizer for soil",
      ],
      nitrogen: ["Ammonium nitrate", "Urea fertilizer for rapid growth"],
      phosphorus: ["Superphosphate", "Bone meal for phosphorus enrichment"],
      potassium: [
        "Potassium chloride",
        "Potassium sulfate for strong root development",
      ],
    };

    const remedies = {
      boron: [
        "Apply boron-based soil amendments",
        "Use boron fertilizer for better flower and fruit set",
      ],
      calcium: [
        "Apply calcium nitrate to prevent blossom end rot",
        "Add lime to the soil for calcium enrichment",
      ],
      healthy: [
        "Ensure proper watering, sunlight, and soil nutrition",
        "Prune dead or diseased branches",
      ],
      iron: [
        "Apply iron chelate for yellowing leaves",
        "Ensure proper soil pH to improve iron uptake",
      ],
      magnesium: [
        "Use Epsom salts to prevent yellowing between leaf veins",
        "Increase magnesium levels in the soil",
      ],
      manganese: [
        "Apply manganese sulfate for chlorosis",
        "Ensure proper soil pH for better manganese uptake",
      ],
      nitrogen: [
        "Add nitrogen-rich fertilizer for rapid green growth",
        "Top-dress with organic compost to improve nitrogen levels",
      ],
      phosphorus: [
        "Apply superphosphate for stronger root development",
        "Use bone meal to enrich soil phosphorus levels",
      ],
      potassium: [
        "Apply potassium sulfate to improve plant vigor",
        "Use potassium-rich fertilizer for better disease resistance",
      ],
    };
    return Response.json({
      message: "Image predicited",
      prediction: res,
      confidence: confidence,
      fertilizers: fertilizers[prediciton],
      remedies: remedies[prediciton],
    });
  }
}
