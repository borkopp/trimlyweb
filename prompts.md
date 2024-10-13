# Barber Shop Appointment Booking System

## Project Overview

This project is a modern web application designed for a barber shop to manage appointments, services, and barbers. It should provide a user-friendly interface for both customers and administrators to interact. It should be as responsive and as smooth as possible.

## Important Notes

It is important that you use the following technologies and practices:

## Technologies

- Next.js 14 with App Router!
- TypeScript
- Tailwind CSS
- Shadcn UI components
- Supabase Auth
- Supabase Storage
- Supabase Postgres

## Development Practices

- Nextjs 14 Best Practices
- Using Nextjs 14 with App Router, Server Actions, Server Components basically nextjs 14's best practices
- TypeScript for type safety
- Responsive and accessible UI
- Error handling and user feedback (toasts)

- **Image Handling**:

  - Next.js Image component
  - Supabase Storage for image uploads
  - I upload all images to the supabase storage bucket "barber-images"
  - Acess the image from the supabase storage bucket "barber-images":

    ```ts
    async function getImageUrl(path: string) {
      const supabase = createClient();
      const {data} = await supabase.storage.from("barber-images").getPublicUrl(path);

      return data?.publicUrl || null;
    }
    ```

- **isLoading**:
- Always use this spinner when the data is loading

```ts
<div className="flex items-center justify-center">
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary self-center"></div>
</div>
```
