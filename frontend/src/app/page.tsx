// frontend/src/app/mainpage.tsx
export default function Home() {
  return (
    <div 
      className="relative flex min-h-screen items-center justify-center text-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/catsing.gif')" }}
    >
      {/* แผ่นสีดำจางๆ (Opacity 60%) ซ้อนทับ เพื่อให้ UI ด้านหน้าดูเด่นและอ่านง่าย */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* เนื้อหาหลักของหน้าเว็บ (อยู่ชั้นบนสุดด้วย z-10) */}
      <div className="relative z-10 text-center p-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider drop-shadow-lg text-pink-500">
          HAEKPAK KARAOKE
        </h1>
        <p className="mt-2 text-lg text-gray-200">
          ระบบจองห้องคาราโอเกะออนไลน์
        </p>
      </div>
    </div>
  );
}