import { seedDatabase } from "./seed.js";

export default async function test(){
  try{
    await seedDatabase();
  }catch(err){
    console.log("test error:", err)
  }
}