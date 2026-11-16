<script setup lang="ts">
import { computed } from 'vue'
import { useUser } from 'src/stores/user'
import { userRoleOptions } from 'src/repositories/user'

const userManager = useUser()

const me = computed(() => userManager.me)

const fullName = computed(() => {
  const name = [me.value?.firstname, me.value?.lastname].filter(Boolean).join(' ').trim()
  return name || me.value?.username || 'کاربر'
})

const initial = computed(() => (Array.from(fullName.value)[0] || 'ک').toUpperCase())

const roleLabels = computed(() => {
  const roles = (me.value?.roles_list?.length ? me.value.roles_list : me.value?.roles?.map((role) => role.name)) || []
  return roles.filter(Boolean).map((role) => translateRole(String(role)))
})

function translateRole (roleName: string): string {
  return userRoleOptions.find((role) => role.value === roleName)?.label || roleName
}

function logout () {
  userManager.logout()
}
</script>

<template>
  <q-btn
    v-if="me"
    round
    flat
    color="primary"
    class="icon-button user-menu-trigger"
    aria-label="منوی کاربر"
    style="padding: 0">
    <q-avatar class="user-menu-trigger__avatar">
      <span>{{ initial }}</span>
    </q-avatar>
    <q-tooltip>{{ fullName }}</q-tooltip>

    <q-menu
      transition-show="jump-down"
      transition-hide="jump-up"
      class="user-menu"
      content-class="user-menu-content">
      <div class="profile-menu">
        <div class="profile-menu__cover">
          <div class="profile-menu__decor profile-menu__decor--one" />
          <div class="profile-menu__decor profile-menu__decor--two" />
          <div class="profile-menu__avatar-ring">
            <q-avatar class="profile-menu__avatar">
              <span class="profile-menu__initial">{{ initial }}</span>
              <q-badge
                color="positive"
                floating
                rounded
                class="profile-menu__online" />
            </q-avatar>
          </div>
        </div>

        <div class="profile-menu__body">
          <div class="profile-menu__name">{{ fullName }}</div>
          <div
            v-if="me.username"
            class="profile-menu__username">
            @{{ me.username }}
          </div>

          <div
            v-if="roleLabels.length"
            class="profile-menu__roles">
            <span
              v-for="(role, index) in roleLabels"
              :key="`${role}-${index}`"
              class="profile-menu__role"
              :class="`profile-menu__role--${index % 3}`">
              {{ role }}
            </span>
          </div>

          <div class="profile-menu__details">
            <div
              v-if="me.employee_code"
              class="profile-menu__detail">
              <span class="profile-menu__detail-icon profile-menu__detail-icon--blue"><q-icon name="badge" /></span>
              <span class="profile-menu__detail-text">کد پرسنلی: {{ me.employee_code }}</span>
            </div>
            <div
              v-if="me.email"
              class="profile-menu__detail">
              <span class="profile-menu__detail-icon profile-menu__detail-icon--pink"><q-icon name="mail" /></span>
              <span class="profile-menu__detail-text">{{ me.email }}</span>
            </div>
            <div
              v-if="me.mobile"
              class="profile-menu__detail">
              <span class="profile-menu__detail-icon profile-menu__detail-icon--violet"><q-icon name="smartphone" /></span>
              <span class="profile-menu__detail-text">{{ me.mobile }}</span>
            </div>
          </div>
        </div>

        <q-separator class="profile-menu__divider" />
        <div class="profile-menu__footer">
          <q-btn
            v-close-popup
            no-caps
            flat
            class="profile-menu__logout"
            icon="logout"
            label="خروج از حساب"
            @click="logout" />
        </div>
      </div>
    </q-menu>
  </q-btn>
</template>

<style scoped lang="scss">
.user-menu-trigger {
  color: $color-text1;
  background: $neutral-95;
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease;

  &:hover {
    background: rgba(25, 118, 210, 0.12);
    color: $primary;
    transform: scale(1.06);
  }

  &__avatar {
    width: 38px;
    height: 38px;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    background: linear-gradient(135deg, #8dd8f5, #a99af4 58%, #f5a9d2);
    border: 2px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 0 2px rgba(139, 127, 232, 0.22);
  }
}

.profile-menu {
  width: 320px;
  max-width: calc(100vw - 24px);
  direction: rtl;
  text-align: right;
  color: #344054;
  background: #fff;
  border: 1px solid #edf0f7;
  border-radius: 28px;

  &__cover {
    position: relative;
    height: 112px;
    overflow: hidden;              // ✅ فقط همین‌جا
    border-radius: 28px 28px 0 0;  // ✅ گرد شدن گوشه‌ها فقط بالای هدر
    background: linear-gradient(120deg, #e2f5ff 0%, #eeeaff 54%, #fff0f7 100%);
  }

  &__decor {
    position: absolute;
    border-radius: 50%;
    filter: blur(2px);
    pointer-events: none;
  }

  &__decor--one {
    top: -48px;
    right: -20px;
    width: 150px;
    height: 150px;
    background: rgba(132, 203, 242, 0.34);
    filter: blur(12px);
  }

  &__decor--two {
    bottom: -72px;
    left: 16px;
    width: 180px;
    height: 150px;
    background: rgba(235, 168, 214, 0.34);
    filter: blur(16px);
  }

  &__avatar-ring {
    position: relative;
    z-index: 2;
    width: 86px;
    margin: 12px auto 0;
    padding: 5px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 8px 22px rgba(89, 91, 143, 0.18);
  }

  &__avatar {
    width: 76px;
    height: 76px;
    color: #fff;
    background: linear-gradient(140deg, #75c8ee 0%, #9a8ce8 56%, #ed9bc9 100%);
    border: 3px solid #fff;
  }

  &__initial {
    font-size: 30px;
    font-weight: 700;
    text-shadow: 0 2px 8px rgba(63, 59, 120, 0.2);
  }

  &__online {
    width: 14px;
    height: 14px;
    border: 3px solid #fff;
    box-sizing: content-box;
  }

  &__body {
    padding: 48px 20px 16px;
    text-align: center;
  }

  &__name {
    overflow: hidden;
    color: #30354a;
    font-size: 1.05rem;
    font-weight: 750;
    line-height: 1.45;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__username {
    margin-top: 2px;
    color: #8790a5;
    font-size: 0.78rem;
    direction: ltr;
  }

  &__roles {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 7px;
    margin-top: 11px;
  }

  &__role {
    display: inline-flex;
    align-items: center;
    padding: 4px 11px;
    border: 1px solid transparent;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 650;
    line-height: 1.4;
  }

  &__role--0 {
    color: #397c9d;
    background: #e9f8ff;
    border-color: #d7f0fb;
  }

  &__role--1 {
    color: #7665a8;
    background: #f1edff;
    border-color: #e7e0ff;
  }

  &__role--2 {
    color: #ac6489;
    background: #fff0f7;
    border-color: #f9dfec;
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
  }

  &__detail {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    min-height: 42px;
    padding: 6px 9px;
    color: #626b80;
    background: #f8f9fc;
    border: 1px solid #f0f1f6;
    border-radius: 16px;
    font-size: 0.76rem;
    text-align: right;
  }

  &__detail-icon {
    display: inline-flex;
    flex: 0 0 30px;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 12px;
    font-size: 17px;
  }

  &__detail-icon--blue {
    color: #58a4c7;
    background: #e7f6fc;
  }

  &__detail-icon--pink {
    color: #d17eaa;
    background: #fff0f7;
  }

  &__detail-icon--violet {
    color: #8c7acb;
    background: #f0edff;
  }

  &__detail-text {
    display: block;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__divider {
    margin: 0 20px;
    background: #edf0f5;
  }

  &__footer {
    padding: 12px 20px 18px;
  }

  &__logout {
    width: 100%;
    min-height: 44px;
    color: #c85f70;
    background: #fff2f3;
    border: 1px solid #f9dfe2;
    border-radius: 16px;
    font-weight: 650;
    transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      background: #ffe9ec;
      box-shadow: 0 6px 14px rgba(200, 95, 112, 0.12);
    }
  }
}

:global(.q-menu.user-menu) {
  box-shadow: none;
    background: transparent;
}
</style>
