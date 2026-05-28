<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <nav class="flex items-center justify-center gap-4 p-4 shadow bg-white">
      <RouterLink to="/" class="hover:text-blue-500">
        اضافه کردن
      </RouterLink>
      <RouterLink to="/URLlist" class="hover:text-blue-500">
        لیست لینک ها
      </RouterLink>
    </nav>

    <main class="flex-1 flex items-center justify-center">
      <RouterView />
    </main>

  </div>
</template>