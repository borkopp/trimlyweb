import { MarqueeAnimation } from "@/components/ui/marquee";

function MarqueeLanguages() {
  return (
    <div className="flex flex-col gap-4">
      <MarqueeAnimation
        direction="left"
        baseVelocity={0.15}
        className="bg-black text-xs dark:bg-muted text-primary  py-2"
      >
        Hello  你好  Привет  Hola  Bonjour  Hallo  Ciao  Olá  こんにちは
          안녕하세요  Merhaba  Namaste  Shalom  Ahoj  Hej  Salut  
        Здравствуйте  你好  Привет  Hola  Bonjour  Hallo  Ciao  Olá  
        こんにちは  안녕하세요  Merhaba  Namaste  Shalom  Ahoj  Hej  
        Salut  Здравствуйте  
      </MarqueeAnimation>
      <MarqueeAnimation
        direction="right"
        baseVelocity={0.15}
        className="bg-black text-xs dark:bg-muted text-primary  py-2"
      >
        مرحبا  你好  Привет  Hello  Hola  Bonjour  Hallo  Ciao  Olá  
        こんにちは  안녕하세요  Merhaba  Namaste  Shalom  Ahoj  Hej  
        Salut  Здравствуйте  مرحبا  你好  Привет  Hello  Hola  Bonjour  
        Hallo  Ciao  Olá  こんにちは  안녕하세요  Merhaba  Namaste  
        Shalom  Ahoj  Hej  Salut  Здравствуйте  
      </MarqueeAnimation>
      <MarqueeAnimation
        direction="left"
        baseVelocity={0.15}
        className="bg-black text-xs dark:bg-muted text-primary py-2"
      >
        Здравствуйте  你好  Привет  Hello  Hola  Bonjour  Hallo  Ciao  
        Olá  こんにちは  안녕하세요  Merhaba  Namaste  Shalom  Ahoj  Hej
          Salut  مرحبا  Здравствуйте  你好  Привет  Hello  Hola  Bonjour
          Hallo  Ciao  Olá  こんにちは  안녕하세요  Merhaba  Namaste  
        Shalom  Ahoj  Hej  Salut  مرحبا  
      </MarqueeAnimation>
    </div>
  );
}

export { MarqueeLanguages };
