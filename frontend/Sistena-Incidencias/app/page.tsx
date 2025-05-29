import { redirect } from "next/navigation"
import  Principal  from "@/components/landingPage"

export default function Home() {
  return(
    <div className="flex flex-col justify-center items-center ">
      <Principal />
    </div>
  )
}
