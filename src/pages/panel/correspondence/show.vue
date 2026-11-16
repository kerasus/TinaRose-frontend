<template>
  <div class="correspondence-workspace q-pa-sm q-pa-md-lg">
    <!-- وضعیت بارگذاری مینیمال و پرانرژی -->
    <div
      v-if="loading"
      class="loading-state-wrapper flex flex-center column q-py-xl">
      <q-spinner-puff
        size="64px"
        color="primary" />
      <div class="text-subtitle2 text-weight-bold text-grey-8 q-mt-md">در حال بارگذاری جزئیات سند مکاتبه...</div>
      <div class="text-caption text-grey-5">لطفاً چند لحظه شکیبا باشید</div>
    </div>

    <!-- وضعیت عدم دسترسی / خطا -->
    <div
      v-else-if="!correspondence"
      class="not-found-card bg-white q-pa-xl text-center shadow-sm rounded-xl border-subtle">
      <div class="empty-icon-wrap q-mx-auto q-mb-md">
        <q-icon
          name="mark_email_read"
          size="56px"
          color="grey-5" />
      </div>
      <div class="text-h6 text-weight-bolder text-grey-9">نامه مورد نظر یافت نشد یا دسترسی مسدود است</div>
      <p class="text-caption text-grey-6 q-mt-xs q-mx-auto max-w-400">
        ممکن است دسترسی شما تغییر کرده باشد یا این مکاتبه از کارتابل جاری خارج شده باشد.
      </p>
      <q-btn
        unelevated
        color="primary"
        icon="arrow_forward"
        label="بازگشت به کارتابل"
        class="modern-action-btn q-mt-md"
        :to="{ name: 'Panel.Correspondence.List' }" />
    </div>

    <!-- بدنه اصلی فضای کار (Workspace Layout) -->
    <template v-else>
      <!-- نوار کنترل بالایی (Floating Command Bar) -->
      <div class="command-bar bg-white q-px-lg q-py-sm q-mb-md rounded-xl shadow-xs border-subtle row items-center justify-between">
        <div class="row items-center q-gutter-x-md">
          <q-btn
            flat
            round
            dense
            color="grey-8"
            icon="arrow_forward"
            class="back-circle-btn"
            :to="{ name: 'Panel.Correspondence.List' }">
            <q-tooltip>بازگشت به فهرست نامه‌ها</q-tooltip>
          </q-btn>

          <div class="column">
            <div class="row items-center q-gutter-x-sm">
              <span class="id-tag font-mono">#{{ correspondence.id }}</span>
              <span
                v-if="correspondence.reference_number"
                class="ref-tag font-mono">
                شماره: {{ correspondence.reference_number }}
              </span>
              <q-badge
                :color="statusBadgeColor(correspondence.status)"
                rounded
                class="q-px-sm text-weight-bold">
                {{ statusLabel(correspondence.status) }}
              </q-badge>
            </div>
            <div class="subject-title text-weight-bolder text-grey-10 text-ellipsis">
              {{ correspondence.subject }}
            </div>
          </div>
        </div>

        <!-- دکمه‌های اقدام سریع -->
        <div class="row items-center q-gutter-x-sm">
          <!--          <q-btn-->
          <!--            flat-->
          <!--            round-->
          <!--            dense-->
          <!--            color="grey-7"-->
          <!--            icon="print"-->
          <!--            @click="printLetter">-->
          <!--            <q-tooltip>چاپ رسمی نامه</q-tooltip>-->
          <!--          </q-btn>-->

          <q-btn
            v-if="canSend"
            unelevated
            color="primary"
            icon="send"
            label="ارسال نهایی نامه"
            class="modern-action-btn primary-glow"
            :loading="actionLoading"
            @click="sendCorrespondence" />
        </div>
      </div>

      <!-- ساختار دو ستونه مدرن -->
      <div class="row q-col-gutter-lg items-start">
        <!-- ستون سمت راست: تب‌های محتوای سند، گردش کار و پیوست‌ها -->
        <div class="col-12 col-lg-8 column q-gutter-y-md">
          <div class="main-content-card bg-white rounded-xl shadow-sm border-subtle overflow-hidden">
            <!-- نوار تب‌های پیشرفته -->
            <div class="tabs-header-strip row items-center justify-between q-px-md bg-grey-1 border-bottom-subtle">
              <q-tabs
                v-model="activeTab"
                dense
                no-caps
                active-color="primary"
                indicator-color="primary"
                align="left"
                class="modern-tabs text-grey-7">
                <q-tab
                  name="content"
                  icon="description"
                  label="متن و سند نامه" />
                <q-tab
                  name="workflow"
                  icon="account_tree">
                  <div class="row items-center q-gutter-x-xs">
                    <span>زنجیره ارجاعات</span>
                    <q-badge
                      v-if="correspondence.assignments?.length"
                      color="primary"
                      rounded
                      class="q-px-xs">
                      {{ correspondence.assignments.length }}
                    </q-badge>
                  </div>
                </q-tab>
                <q-tab
                  name="attachments"
                  icon="attach_file">
                  <div class="row items-center q-gutter-x-xs">
                    <span>پیوست‌ها</span>
                    <q-badge
                      v-if="correspondence.attachments?.length"
                      color="blue-grey"
                      rounded
                      class="q-px-xs">
                      {{ correspondence.attachments.length }}
                    </q-badge>
                  </div>
                </q-tab>
              </q-tabs>

              <!-- نشان پاسخ به در هدر تب -->
              <div
                v-if="correspondence.reply_to_id"
                class="reply-chip-indicator text-caption text-primary row items-center q-px-sm q-py-xs rounded-borders">
                <q-icon
                  name="reply"
                  size="14px"
                  class="q-mr-xs" />
                <span>عطف: <strong>{{ replyToLabel() }}</strong></span>
              </div>
            </div>

            <!-- بدنه تب‌ها -->
            <q-tab-panels
              v-model="activeTab"
              animated
              class="tab-panels-body">
              <!-- تب اول: سند اداری -->
              <q-tab-panel
                name="content"
                class="q-pa-lg q-pa-md-xl">
                <div class="document-sheet">
                  <!-- سربرگ شکیل نامه -->
                  <div class="doc-header row items-start justify-between q-pb-lg border-bottom-dashed">
                    <div class="column q-gutter-y-xs">
                      <div class="row items-center q-gutter-x-xs text-primary text-weight-bold text-caption">
                        <q-icon
                          name="corporate_fare"
                          size="18px" />
                        <span>سامانه جامع مکاتبات تینارز</span>
                      </div>
                      <h2 class="doc-title text-h6 text-weight-bolder text-grey-10 q-my-none">
                        {{ correspondence.subject }}
                      </h2>
                    </div>

                    <!-- تمبر شماره و تاریخ نامه -->
                    <div class="meta-stamp-box bg-grey-1 q-pa-sm rounded-borders column items-end font-mono">
                      <div class="row items-center text-caption">
                        <span class="text-grey-6 q-mr-xs">شماره ثبت:</span>
                        <span class="text-weight-bold text-primary">{{ correspondence.reference_number || 'پیش‌نویس فاقد شماره' }}</span>
                      </div>
                      <div class="row items-center text-caption">
                        <span class="text-grey-6 q-mr-xs">تاریخ ایجاد:</span>
                        <span class="text-grey-8">{{ fmt(correspondence.created_at) }}</span>
                      </div>
                      <div
                        v-if="correspondence.sent_at"
                        class="row items-center text-caption">
                        <span class="text-grey-6 q-mr-xs">تاریخ ارسال:</span>
                        <span class="text-positive text-weight-bold">{{ fmt(correspondence.sent_at) }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- بج‌های طبقه‌بندی -->
                  <div class="doc-pills-row row items-center q-gutter-sm q-py-md">
                    <div
                      class="pill-chip"
                      :class="`pill-${correspondence.confidentiality}`">
                      <q-icon
                        name="lock"
                        size="13px"
                        class="q-mr-xs" />
                      {{ confidentialityLabel(correspondence.confidentiality) }}
                    </div>
                    <div
                      class="pill-chip"
                      :class="`pill-${correspondence.priority}`">
                      <q-icon
                        name="bolt"
                        size="13px"
                        class="q-mr-xs" />
                      اولویت: {{ priorityLabel(correspondence.priority) }}
                    </div>
                  </div>

                  <!-- متن نامه -->
                  <div class="doc-body-text text-body1 text-grey-9 q-py-lg">
                    {{ correspondence.body || 'فاقد متن اداری.' }}
                  </div>
                </div>
              </q-tab-panel>

              <!-- تب دوم: زنجیره و سابقه ارجاعات -->
              <q-tab-panel
                name="workflow"
                class="q-pa-lg">
                <div
                  v-if="!correspondence.assignments?.length"
                  class="text-center q-pa-lg text-grey-5">
                  <q-icon
                    name="device_hub"
                    size="48px" />
                  <div class="text-subtitle2 q-mt-xs">هنوز هیچ ارجاعی برای این نامه ثبت نشده است.</div>
                </div>

                <div
                  v-else
                  class="workflow-tree-flow column q-gutter-y-lg">
                  <div
                    v-for="root in rootAssignments"
                    :key="root.id"
                    class="workflow-node-card q-mb-md">
                    <!-- کارت ارجاع ریشه -->
                    <div :class="['assignment-card', `status-${root.status}`]">
                      <!-- هدر ارجاع: اطلاعات و نشانگر وضعیت -->
                      <div class="row items-center justify-between q-pb-sm border-b-subtle">
                        <div class="row items-center q-gutter-x-sm">
                          <div
                            class="status-indicator-dot"
                            :class="`bg-${assignmentBadgeColor(root.status)}`" />
                          <span class="text-subtitle2 text-weight-bolder text-grey-9 font-mono">ارجاع #{{ root.id }}</span>
                          <span class="text-caption text-grey-6">
                            (از طرف: <span class="text-weight-medium text-grey-8">{{ userLabel(root.assigned_by, root.assigned_by_id) }}</span>)
                          </span>
                        </div>

                        <q-badge
                          :color="assignmentBadgeColor(root.status)"
                          rounded
                          class="q-px-sm q-py-xs text-weight-bold">
                          {{ assignmentStatusLabel(root.status) }}
                        </q-badge>
                      </div>

                      <!-- بدنه ارجاع: مسئول و پاراف -->
                      <div class="q-py-sm">
                        <div class="row items-center text-body2 q-mb-xs">
                          <span class="text-grey-7 q-mr-xs">مسئول اقدام:</span>
                          <strong class="text-primary">
                            {{ userLabel(root.assigned_to, root.assigned_to_id) }}
                          </strong>
                          <q-badge
                            color="info"
                            rounded
                            class="q-px-sm q-py-xs text-weight-bold q-ml-sm">
                            {{ getFirstUserRoleLabel(root.assigned_to) }}
                          </q-badge>
                        </div>

                        <div
                          v-if="root.note"
                          class="paraph-banner row items-start q-pa-sm rounded-borders q-mt-xs">
                          <q-icon
                            name="format_quote"
                            size="18px"
                            class="q-mr-xs text-primary" />
                          <div class="col text-caption text-grey-9 leading-relaxed">
                            <strong class="text-grey-8">دستور اقدام:</strong> {{ root.note }}
                          </div>
                        </div>
                      </div>

                      <!-- متادیتای مدرن (assignment-meta-v2 بازطراحی شده) -->
                      <div class="assignment-meta-v2 q-mt-xs q-pa-sm rounded-borders">
                        <div class="row q-col-gutter-xs">
                          <div class="col-12 col-sm-6 col-md-4">
                            <div class="meta-item">
                              <q-icon
                                name="event"
                                size="15px"
                                class="meta-icon" />
                              <span class="meta-title">تاریخ ایجاد:</span>
                              <span class="meta-val font-mono">{{ fmt(root.created_at) }}</span>
                            </div>
                          </div>
                          <div class="col-12 col-sm-6 col-md-4">
                            <div class="meta-item">
                              <q-icon
                                name="update"
                                size="15px"
                                class="meta-icon" />
                              <span class="meta-title">آخرین بروزرسانی:</span>
                              <span class="meta-val font-mono">{{ fmt(root.updated_at) }}</span>
                            </div>
                          </div>
                          <div class="col-12 col-sm-6 col-md-4">
                            <div
                              class="meta-item"
                              :class="{ 'highlight-alert': root.due_at }">
                              <q-icon
                                name="alarm"
                                size="15px"
                                class="meta-icon" />
                              <span class="meta-title">مهلت اقدام:</span>
                              <span class="meta-val font-mono">{{ fmt(root.due_at) }}</span>
                            </div>
                          </div>
                          <div class="col-12 col-sm-6 col-md-4">
                            <div class="meta-item">
                              <q-icon
                                name="visibility"
                                size="15px"
                                class="meta-icon" />
                              <span class="meta-title">زمان مطالعه:</span>
                              <span class="meta-val font-mono">{{ fmt(root.read_at) }}</span>
                            </div>
                          </div>
                          <div class="col-12 col-sm-6 col-md-4">
                            <div class="meta-item">
                              <q-icon
                                name="play_circle_outline"
                                size="15px"
                                class="meta-icon" />
                              <span class="meta-title">زمان شروع:</span>
                              <span class="meta-val font-mono">{{ fmt(root.started_at) }}</span>
                            </div>
                          </div>
                          <div class="col-12 col-sm-6 col-md-4">
                            <div
                              class="meta-item"
                              :class="{ 'highlight-success': root.resolved_at }">
                              <q-icon
                                name="check_circle_outline"
                                size="15px"
                                class="meta-icon" />
                              <span class="meta-title">نتیجه / بستن:</span>
                              <span class="meta-val font-mono">{{ fmt(root.resolved_at) }}</span>
                            </div>
                          </div>

                          <!-- یادداشت نتیجه به صورت کارت پیام برجسته -->
                          <div
                            v-if="root.resolution_note"
                            class="col-12 q-mt-xs">
                            <div class="resolution-note-box row items-start q-pa-xs-sm rounded-borders">
                              <q-icon
                                name="task_alt"
                                size="16px"
                                color="positive"
                                class="q-mr-xs q-mt-xs" />
                              <div class="col text-caption">
                                <span class="text-weight-bold text-grey-8">یادداشت نتیجه:</span>
                                <span class="text-grey-9 q-ml-xs">{{ root.resolution_note }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- نوار عملیات (Action Buttons) -->
                      <div
                        v-if="isMyAssignment(root) && (root.status === 'pending' || root.status === 'in_progress')"
                        class="row items-center justify-end q-gutter-xs q-mt-sm q-pt-xs border-t-subtle">
                        <q-btn
                          v-if="root.status === 'pending'"
                          dense
                          unelevated
                          size="sm"
                          color="primary"
                          icon="play_arrow"
                          label="شروع اقدام"
                          class="modern-btn q-px-sm"
                          :loading="actionLoading"
                          @click="startAssignment(root.id)" />
                        <q-btn
                          v-if="root.status === 'in_progress'"
                          dense
                          unelevated
                          size="sm"
                          color="positive"
                          icon="check"
                          label="تکمیل"
                          class="modern-btn q-px-sm"
                          :loading="actionLoading"
                          @click="openResolve(root, 'complete')" />
                        <q-btn
                          dense
                          unelevated
                          size="sm"
                          color="negative"
                          icon="close"
                          label="رد"
                          class="modern-btn q-px-sm"
                          :loading="actionLoading"
                          @click="openResolve(root, 'reject')" />
                        <q-btn
                          dense
                          outline
                          size="sm"
                          color="secondary"
                          icon="subdirectory_arrow_left"
                          label="ارجاع فرزند"
                          class="modern-btn q-px-sm"
                          @click="openChild(root)" />
                      </div>
                    </div>

                    <!-- شاخه‌های فرزند (Nested Children) -->
                    <div
                      v-if="childrenOf(root.id).length"
                      class="assignment-children-tree q-mt-xs">
                      <div
                        v-for="child in childrenOf(root.id)"
                        :key="child.id"
                        class="child-node-item">
                        <div :class="['assignment-card child-card', `status-${child.status}`]">
                          <div class="row items-center justify-between q-pb-xs border-b-subtle">
                            <div class="row items-center q-gutter-x-xs">
                              <q-icon
                                name="subdirectory_arrow_left"
                                color="secondary"
                                size="18px" />
                              <span class="text-caption text-weight-bolder text-grey-9 font-mono">ارجاع فرزند #{{ child.id }}</span>
                              <span class="text-caption text-grey-7">
                                (مسئول:
                                <strong class="text-secondary">{{ userLabel(child.assigned_to, child.assigned_to_id) }}</strong>
                                <q-badge
                                  color="info"
                                  rounded
                                  class="q-px-sm q-py-xs text-weight-bold q-ml-sm">
                                  {{ getFirstUserRoleLabel(child.assigned_to) }}
                                </q-badge>
                                )
                              </span>
                            </div>
                            <q-badge
                              :color="assignmentBadgeColor(child.status)"
                              outline
                              class="text-caption">
                              {{ assignmentStatusLabel(child.status) }}
                            </q-badge>
                          </div>

                          <div
                            v-if="child.note"
                            class="paraph-banner paraph-child row items-start q-pa-xs rounded-borders q-my-xs">
                            <q-icon
                              name="chat"
                              size="14px"
                              class="q-mr-xs text-secondary" />
                            <div class="col text-caption text-grey-8">
                              <strong>دستور:</strong> {{ child.note }}
                            </div>
                          </div>

                          <!-- متادیتای فرزند -->
                          <div class="assignment-meta-v2 meta-child q-mt-xs q-pa-xs rounded-borders">
                            <div class="row q-col-gutter-xs">
                              <div class="col-12 col-sm-6 col-md-4">
                                <div class="meta-item">
                                  <span class="meta-title">ایجاد:</span>
                                  <span class="meta-val font-mono">{{ fmt(child.created_at) }}</span>
                                </div>
                              </div>
                              <div class="col-12 col-sm-6 col-md-4">
                                <div class="meta-item">
                                  <span class="meta-title">بروزرسانی:</span>
                                  <span class="meta-val font-mono">{{ fmt(child.updated_at) }}</span>
                                </div>
                              </div>
                              <div class="col-12 col-sm-6 col-md-4">
                                <div
                                  class="meta-item"
                                  :class="{ 'highlight-alert': child.due_at }">
                                  <span class="meta-title">مهلت:</span>
                                  <span class="meta-val font-mono">{{ fmt(child.due_at) }}</span>
                                </div>
                              </div>
                              <div class="col-12 col-sm-6 col-md-4">
                                <div class="meta-item">
                                  <span class="meta-title">مطالعه:</span>
                                  <span class="meta-val font-mono">{{ fmt(child.read_at) }}</span>
                                </div>
                              </div>
                              <div class="col-12 col-sm-6 col-md-4">
                                <div class="meta-item">
                                  <span class="meta-title">شروع:</span>
                                  <span class="meta-val font-mono">{{ fmt(child.started_at) }}</span>
                                </div>
                              </div>
                              <div class="col-12 col-sm-6 col-md-4">
                                <div
                                  class="meta-item"
                                  :class="{ 'highlight-success': child.resolved_at }">
                                  <span class="meta-title">نتیجه:</span>
                                  <span class="meta-val font-mono">{{ fmt(child.resolved_at) }}</span>
                                </div>
                              </div>

                              <div
                                v-if="child.resolution_note"
                                class="col-12 q-mt-xs">
                                <div class="resolution-note-box row items-start q-pa-xs rounded-borders">
                                  <q-icon
                                    name="check_circle"
                                    size="14px"
                                    color="positive"
                                    class="q-mr-xs" />
                                  <div class="col text-caption">
                                    <span class="text-weight-bold text-grey-8">یادداشت نتیجه:</span>
                                    <span class="text-grey-9 q-ml-xs">{{ child.resolution_note }}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- اکشن‌های فرزند -->
                          <div
                            v-if="isMyAssignment(child) && (child.status === 'pending' || child.status === 'in_progress')"
                            class="row items-center justify-end q-gutter-xs q-mt-xs">
                            <q-btn
                              v-if="child.status === 'pending'"
                              dense
                              unelevated
                              size="xs"
                              color="primary"
                              icon="play_arrow"
                              label="شروع"
                              :loading="actionLoading"
                              @click="startAssignment(child.id)" />
                            <q-btn
                              v-if="child.status === 'in_progress'"
                              dense
                              unelevated
                              size="xs"
                              color="positive"
                              icon="check"
                              label="تکمیل"
                              :loading="actionLoading"
                              @click="openResolve(child, 'complete')" />
                            <q-btn
                              dense
                              unelevated
                              size="xs"
                              color="negative"
                              icon="close"
                              label="رد"
                              :loading="actionLoading"
                              @click="openResolve(child, 'reject')" />
                            <q-btn
                              dense
                              outline
                              size="xs"
                              color="secondary"
                              icon="subdirectory_arrow_left"
                              label="ارجاع بعدی"
                              @click="openChild(child)" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-tab-panel>

              <!-- تب سوم: پیوست‌ها و آپلود -->
              <q-tab-panel
                name="attachments"
                class="q-pa-lg">
                <!-- بخش آپلود در پیش‌نویس -->
                <div
                  v-if="canAttach"
                  class="upload-drop-area q-pa-md rounded-borders q-mb-lg">
                  <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-sm row items-center q-gutter-x-xs">
                    <q-icon
                      name="cloud_upload"
                      size="20px"
                      color="primary" />
                    <span>بارگذاری فایل جدید برای این مکاتبه</span>
                  </div>
                  <div class="row q-col-gutter-sm items-center">
                    <div class="col-12 col-sm-8">
                      <q-file
                        v-model="attachFile"
                        dense
                        outlined
                        label="انتخاب فایل پیوست..."
                        :error="!!attachError"
                        :error-message="attachError">
                        <template #prepend>
                          <q-icon name="attach_file" />
                        </template>
                      </q-file>
                    </div>
                    <div class="col-12 col-sm-4">
                      <q-btn
                        unelevated
                        color="primary"
                        icon="upload"
                        label="شروع آپلود"
                        class="full-width modern-action-btn"
                        :loading="attachLoading"
                        :disable="!attachFile"
                        @click="uploadAttachment" />
                    </div>
                  </div>
                </div>

                <!-- لیست پیوست‌ها به صورت کارت‌های مدرن -->
                <div
                  v-if="correspondence.attachments?.length"
                  class="row q-col-gutter-sm">
                  <div
                    v-for="a in correspondence.attachments"
                    :key="a.id"
                    class="col-12 col-sm-6">
                    <div class="attachment-modern-card row items-center q-pa-sm rounded-borders border-subtle">
                      <div class="file-thumb q-mr-sm">
                        <q-img
                          v-if="isImageAttachment(a) && a.path"
                          :src="a.path"
                          class="rounded-borders cursor-pointer fit"
                          @click="openImagePreview(a)" />
                        <q-icon
                          v-else
                          name="insert_drive_file"
                          size="28px"
                          color="primary" />
                      </div>
                      <div class="column col overflow-hidden">
                        <div
                          class="text-weight-bold text-caption text-primary text-ellipsis cursor-pointer"
                          @click="isImageAttachment(a) && a.path ? openImagePreview(a) : null">
                          {{ a.original_name }}
                        </div>
                        <div
                          class="text-caption text-grey-6 font-mono"
                          style="font-size: 0.72rem;">
                          {{ formatBytes(a.size_bytes) }} • {{ userLabel(a.uploaded_by, a.uploaded_by_id) }}
                        </div>
                      </div>
                      <q-btn
                        v-if="a.path"
                        flat
                        round
                        dense
                        size="sm"
                        color="grey-7"
                        icon="download"
                        tag="a"
                        :href="a.path"
                        target="_blank"
                        download>
                        <q-tooltip>دانلود</q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="text-center text-grey-5 q-pa-lg">
                  هیچ فایلی به این نامه پیوست نشده است.
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>

        <!-- ستون سمت چپ: سایدبار متادیتای چابک (Quick Info Rail) -->
        <div class="col-12 col-lg-4 column q-gutter-y-md">
          <!-- کارت مشخصات فرستنده -->
          <div class="side-card bg-white q-pa-md rounded-xl shadow-xs border-subtle">
            <div class="card-head-title row items-center q-gutter-x-xs text-grey-7 q-mb-sm">
              <q-icon
                name="person"
                size="18px"
                color="primary" />
              <span class="text-caption text-weight-bold">ثبت‌کننده نامه</span>
            </div>
            <div class="row items-center q-gutter-x-md">
              <q-avatar
                size="44px"
                color="indigo-1"
                text-color="primary"
                class="font-mono text-weight-bold">
                {{ userInitial(correspondence.sender) }}
              </q-avatar>
              <div class="column">
                <div class="text-subtitle2 text-weight-bolder text-grey-9">{{ senderLabel(correspondence) }}</div>
                <div class="text-caption text-grey-6 font-mono">{{ correspondence.sender?.email || correspondence.sender?.username || '—' }}</div>
              </div>
            </div>
          </div>

          <!-- کارت گیرندگان نامه -->
          <div
            v-if="correspondence.recipients?.length"
            class="side-card bg-white q-pa-md rounded-xl shadow-xs border-subtle">
            <div class="row items-center justify-between q-mb-sm">
              <div class="card-head-title row items-center q-gutter-x-xs text-grey-7">
                <q-icon
                  name="group"
                  size="18px"
                  color="primary" />
                <span class="text-caption text-weight-bold">گیرندگان سند</span>
              </div>
              <div class="row items-center q-gutter-x-xs">
                <q-badge
                  color="grey-3"
                  text-color="grey-8"
                  rounded
                  class="q-px-xs">
                  {{ correspondence.recipients.length }}
                </q-badge>
                <q-btn
                  v-if="isSender"
                  flat
                  dense
                  round
                  icon="person_add"
                  color="primary"
                  size="sm"
                  @click="openRecipientDialog">
                  <q-tooltip>افزودن گیرنده</q-tooltip>
                </q-btn>
              </div>
            </div>

            <div class="column q-gutter-y-xs">
              <div
                v-for="r in correspondence.recipients"
                :key="r.id"
                class="recipient-badge-row row items-center justify-between q-pa-xs rounded-borders">
                <div class="row items-center q-gutter-x-xs">
                  <span :class="['rec-type-tag', r.type === 'to' ? 'is-to' : 'is-cc']">
                    {{ r.type === 'to' ? 'اصل' : 'رونوشت' }}
                  </span>
                  <span class="text-caption text-weight-bold text-grey-9">
                    {{ userLabel(r.user, r.user_id) }}
                    <q-badge
                      color="info"
                      rounded
                      class="q-px-sm q-py-xs text-weight-bold q-ml-sm">
                      {{ getFirstUserRoleLabel(r.user) }}
                    </q-badge>
                  </span>
                </div>
                <div class="column items-end">
                  <div
                    class="text-caption text-grey-5 row items-center font-mono"
                    style="font-size: 0.72rem;">
                    <q-icon
                      :name="r.read_at ? 'done_all' : 'schedule'"
                      size="13px"
                      class="q-mr-xs"
                      :color="r.read_at ? 'positive' : 'grey-5'" />
                    <span>{{ r.read_at ? fmt(r.read_at) : 'دیده‌نشده' }}</span>
                  </div>
                  <div
                    v-if="r.due_at"
                    class="text-caption text-orange-9 row items-center font-mono"
                    style="font-size: 0.72rem;">
                    <q-icon
                      name="event"
                      size="13px"
                      class="q-mr-xs" />
                    <span>مهلت: {{ fmt(r.due_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- گاه‌شمار رویدادها (Timeline فشرده و تمیز) -->
          <div
            v-if="correspondence.events?.length"
            class="side-card bg-white q-pa-md rounded-xl shadow-xs border-subtle">
            <div class="card-head-title row items-center q-gutter-x-xs text-grey-7 q-mb-md">
              <q-icon
                name="history"
                size="18px"
                color="primary" />
              <span class="text-caption text-weight-bold">گاه‌شمار رویدادها</span>
            </div>

            <q-timeline
              dense
              color="primary"
              class="compact-timeline">
              <q-timeline-entry
                v-for="ev in correspondence.events"
                :key="ev.id"
                :title="eventTypeLabel(ev.event_type)"
                :subtitle="fmt(ev.created_at)"
                :icon="eventIcon(ev.event_type)"
                size="sm">
                <div class="text-caption text-grey-8">
                  توسط: <strong class="text-grey-9">{{ userLabel(ev.actor, ev.actor_id) }}</strong>
                  <span
                    v-if="ev.assignment_id"
                    class="text-weight-bold text-primary font-mono"> (ارجاع #{{ ev.assignment_id }})</span>
                </div>
                <div
                  v-if="ev.event_type === 'assigned' && eventAssigneeId(ev)"
                  class="text-caption text-grey-8 q-mt-xs">
                  <q-icon
                    name="arrow_forward"
                    size="14px"
                    class="q-mr-xs"
                    color="primary" />
                  {{ ev.metadata?.recipient_added ? 'گیرنده اضافه شد:' : (ev.metadata?.root ? 'ارجاع اصلی:' : 'ارجاع به:') }}
                  <strong class="text-grey-9">{{ eventUserName(ev) }}</strong>
                  <span v-if="ev.metadata?.type === 'cc'"> (رونوشت)</span>
                  <span v-if="ev.metadata?.due_at"> — مهلت: {{ fmt(ev.metadata.due_at) }}</span>
                </div>
              </q-timeline-entry>
            </q-timeline>
          </div>
        </div>
      </div>
    </template>

    <!-- دیالوگ ایجاد ارجاع فرزند -->
    <q-dialog
      v-model="childDialog"
      persistent
      transition-show="scale"
      transition-hide="scale">
      <q-card class="child-dialog-card rounded-xl overflow-hidden">
        <q-card-section class="child-dialog-header row items-center no-wrap">
          <q-avatar
            color="white"
            text-color="primary"
            icon="call_split"
            size="40px"
            class="q-mr-md" />
          <div class="col">
            <div class="text-h6 text-weight-bold text-white">ایجاد ارجاع فرزند</div>
            <div class="text-caption text-blue-1">ارجاع وظیفه یا پیگیری به کارشناسان و همکاران</div>
          </div>
          <q-btn
            v-close-popup
            dense
            flat
            round
            icon="close"
            color="white" />
        </q-card-section>

        <q-card-section class="child-dialog-form">
          <form-builder-select-user
            v-model:value="childForm.assigned_to_id"
            label="ارجاع به کارشناس / مدیر" />

          <q-input
            v-model="childForm.note"
            label="شرح وظیفه / دستور اقدام"
            placeholder="توضیحات و دستورات لازم را بنویسید..."
            outlined
            type="textarea"
            autogrow
            :input-style="{ minHeight: '110px', lineHeight: '1.8' }"
            :error="!!childErrors.note"
            :error-message="childErrors.note">
            <template #prepend>
              <q-icon
                name="edit_note"
                color="primary" />
            </template>
          </q-input>

          <form-builder-date-time
            v-model:value="childForm.due_at"
            label="مهلت اقدام (اختیاری)"
            dense
            outlined />
        </q-card-section>

        <q-separator />

        <q-card-actions
          align="between"
          class="child-dialog-actions q-pa-md">
          <q-btn
            v-close-popup
            flat
            color="grey-7"
            label="انصراف" />
          <q-btn
            unelevated
            color="primary"
            icon="send"
            label="ثبت و ارسال ارجاع"
            class="modern-action-btn"
            :loading="actionLoading"
            @click="submitChild" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- دیالوگ اقدام / حل‌وفصل ارجاع -->
    <q-dialog
      v-model="resolveDialog"
      persistent>
      <q-card style="min-width: 380px; max-width: 90vw; border-radius: 14px;">
        <q-card-section
          class="row items-center justify-between text-white q-py-sm"
          :class="resolveMode === 'complete' ? 'bg-positive' : 'bg-negative'">
          <div class="text-subtitle1 text-weight-bold">
            {{ resolveMode === 'complete' ? 'تکمیل اقدام ارجاع' : 'رد ارجاع نامه' }}
          </div>
          <q-btn
            v-close-popup
            dense
            flat
            round
            icon="close" />
        </q-card-section>
        <q-card-section class="q-pt-md">
          <q-input
            v-model="resolveNote"
            :label="resolveMode === 'complete' ? 'گزارش نتیجه و توضیحات تکمیلی (اختیاری)' : 'علت رد ارجاع'"
            outlined
            dense
            type="textarea"
            autogrow />
        </q-card-section>
        <q-separator />
        <q-card-actions
          align="right"
          class="q-pa-sm">
          <q-btn
            v-close-popup
            flat
            color="grey-8"
            label="انصراف" />
          <q-btn
            unelevated
            :color="resolveMode === 'complete' ? 'positive' : 'negative'"
            :icon="resolveMode === 'complete' ? 'check' : 'close'"
            label="ثبت نهایی"
            :loading="actionLoading"
            @click="submitResolve" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- افزودن گیرنده جدید -->
    <q-dialog v-model="recipientDialog">
      <q-card style="min-width: 380px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle1">افزودن گیرنده به نامه</div>
          <q-space />
          <q-btn
            v-close-popup
            icon="close"
            flat
            round
            dense />
        </q-card-section>
        <q-card-section class="q-gutter-y-md">
          <form-builder-select-user
            v-model:value="recipientForm.user_id"
            label="گیرنده" />
          <q-select
            v-model="recipientForm.type"
            :options="recipientTypeOptions"
            label="نوع"
            outlined
            dense
            emit-value
            map-options
            :error="!!recipientErrors.type"
            :error-message="recipientErrors.type"
            @update:model-value="onRecipientTypeChange" />
          <form-builder-date-time
            v-if="recipientForm.type !== 'cc'"
            v-model:value="recipientForm.due_at"
            label="مهلت این گیرنده (اختیاری)"
            outlined
            dense />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            label="انصراف" />
          <q-btn
            color="primary"
            label="افزودن"
            :loading="actionLoading"
            @click="submitRecipient" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- پیشنمایش تصویر -->
    <q-dialog v-model="previewDialog">
      <q-card style="width: 90vw; max-width: 90vw; border-radius: 12px; overflow: hidden;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle1 ellipsis">{{ previewAttachment?.original_name }}</div>
          <q-space />
          <q-btn
            v-close-popup
            icon="close"
            flat
            round
            dense />
        </q-card-section>
        <q-card-section class="q-pt-sm">
          <q-img
            v-if="previewAttachment?.path"
            :src="previewAttachment.path"
            :alt="previewAttachment.original_name"
            fit="contain"
            style="max-height: 80vh; width: 100%" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useDate } from 'src/composables/Date'
import { useUser } from 'src/stores/user'
import UserAPI, { getUserRoleLabel } from 'src/repositories/user'
import FormBuilderDateTime from 'src/components/controls/formBuilderCustomInput/FormBuilderDateTime.vue'
import FormBuilderSelectUser from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectUser.vue'
import CorrespondenceAPI, {
  type Correspondence,
  type CorrespondenceAssignment,
  type CorrespondenceAttachment,
  type CorrespondenceEvent,
  type CorrespondenceUser,
  getAssignmentStatusLabel,
  getCorrespondenceConfidentialityLabel,
  getCorrespondenceEventTypeLabel,
  getCorrespondencePriorityLabel,
  getCorrespondenceStatusLabel
} from 'src/repositories/correspondence'


defineOptions({
  name: 'CorrespondenceShowPage'
})

const $q = useQuasar()
const route = useRoute()
const dateManager = useDate()
const userStore = useUser()
const correspondenceAPI = new CorrespondenceAPI()
const userAPI = new UserAPI()

const loading = ref(false)
const actionLoading = ref(false)
const attachLoading = ref(false)
const correspondence = ref<Correspondence | null>(null)
const attachFile = ref<File | null>(null)
const attachError = ref('')
const eventUsers = ref<Record<number, CorrespondenceUser>>({})

const activeTab = ref<'content' | 'workflow' | 'attachments'>('content')

const childDialog = ref(false)
const resolveDialog = ref(false)
const resolveMode = ref<'complete' | 'reject'>('complete')
const resolveTarget = ref<CorrespondenceAssignment | null>(null)
const resolveNote = ref('')
const childTarget = ref<CorrespondenceAssignment | null>(null)
const childForm = ref<{ assigned_to_id: number | null; note: string; due_at: string | null }>({
  assigned_to_id: null,
  note: '',
  due_at: null
})
const childErrors = ref<Record<string, string>>({})

const previewDialog = ref(false)
const previewAttachment = ref<CorrespondenceAttachment | null>(null)

const recipientDialog = ref(false)
const recipientForm = ref<{ user_id: number | null, type: 'to' | 'cc', due_at: string | null }>({
  user_id: null,
  type: 'to',
  due_at: null
})
const recipientErrors = ref<Record<string, string>>({})
const recipientTypeOptions = [
  { label: 'گیرنده اصلی (To)', value: 'to' },
  { label: 'رونوشت (CC)', value: 'cc' }
]

function isImageAttachment (a: CorrespondenceAttachment): boolean {
  return !!a.mime_type && a.mime_type.startsWith('image/')
}

function openImagePreview (a: CorrespondenceAttachment) {
  if (!a.path || !isImageAttachment(a)) return
  previewAttachment.value = a
  previewDialog.value = true
}

function printLetter () {
  window.print()
}

const correspondenceId = computed(() => Number(route.params.id))
const isSender = computed(() => correspondence.value?.sender_id.toString() === userStore.me?.id.toString())
const isDraft = computed(() => correspondence.value?.status === 'draft')
const canSend = computed(() => isSender.value && isDraft.value)
const canAttach = computed(() => isSender.value && isDraft.value)

const allAssignments = computed<CorrespondenceAssignment[]>(() => correspondence.value?.assignments || [])
const rootAssignments = computed<CorrespondenceAssignment[]>(() => allAssignments.value.filter((a) => !a.parent_assignment_id))

function childrenOf (id: number) {
  return allAssignments.value.filter((a) => a.parent_assignment_id === id)
}

function fmt (v: string | null | undefined) {
  if (!v) return '-'
  const normalized = String(v).replace(' ', 'T')
  const formats = ['YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ', 'YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DD']
  for (const f of formats) {
    try {
      const out = dateManager.miladiToShamsi(normalized, f, 'HH:mm jYYYY/jMM/jDD')
      if (out) return out
    } catch {
      // ادامه
    }
  }
  return String(v)
}

function formatBytes (bytes: number | null | undefined) {
  if (!bytes) return '0 بایت'
  const k = 1024
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function userInitial (user?: CorrespondenceUser | null) {
  if (!user) return '؟'
  return (user.firstname?.[0] || user.username?.[0] || 'ک').toUpperCase()
}

function senderLabel (c: Correspondence) {
  return userLabel(c.sender, c.sender_id)
}

function replyToLabel () {
  const rt = correspondence.value?.reply_to
  if (!rt) return correspondence.value?.reply_to_id ? `نامه #${correspondence.value.reply_to_id}` : '-'
  const refNum = rt.reference_number || `#${rt.id}`
  const subj = rt.subject ? ` - ${rt.subject}` : ''
  return `${refNum}${subj}`
}

function getFirstUserRoleLabel (user?: CorrespondenceUser | null) {
  if (!user || user.roles_list.length === 0) return ''

  return getUserRoleLabel(user.roles_list[0])
}

function userLabel (user?: CorrespondenceUser | null, id?: number | null) {
  if (user) {
    const name = [user.firstname, user.lastname].filter(Boolean).join(' ').trim()
    const code = user.employee_code ? ` (${user.employee_code})` : ''
    return (name || user.username || `کاربر #${user.id}`) + code
  }
  return id ? `کاربر #${id}` : '-'
}

function statusLabel (v: any) { return getCorrespondenceStatusLabel(v) }
function priorityLabel (v: any) { return getCorrespondencePriorityLabel(v) }
function confidentialityLabel (v: any) { return getCorrespondenceConfidentialityLabel(v) }
function assignmentStatusLabel (v: any) { return getAssignmentStatusLabel(v) }
function eventTypeLabel (v: any) { return getCorrespondenceEventTypeLabel(v) }
function isMyAssignment (a: CorrespondenceAssignment) { return a.assigned_to_id.toString() === userStore.me?.id.toString() }

function statusBadgeColor (status: string | undefined) {
  switch (status) {
    case 'sent': return 'positive'
    case 'draft': return 'amber-9'
    case 'archived': return 'grey-7'
    default: return 'primary'
  }
}

function assignmentBadgeColor (status: string | undefined) {
  switch (status) {
    case 'completed': return 'positive'
    case 'in_progress': return 'primary'
    case 'rejected': return 'negative'
    default: return 'warning'
  }
}

function eventIcon (type: string | undefined) {
  switch (type?.toLowerCase()) {
    case 'sent': return 'send'
    case 'read': return 'visibility'
    case 'assigned': return 'forward_to_inbox'
    case 'completed': return 'check_circle'
    case 'rejected': return 'cancel'
    default: return 'radio_button_checked'
  }
}

function handleError (e: any) {
  const status = e?.response?.status
  if (status === 422) {
    const errs = e.response.data?.errors || {}
    const first = Object.values(errs)[0] as any
    const msg = Array.isArray(first) ? first[0] : (e.response.data?.message || 'اطلاعات نامعتبر است.')
    $q.notify({ type: 'negative', message: msg })
    return errs
  }
  if (status === 403) {
    $q.notify({ type: 'negative', message: e?.response?.data?.message || 'دسترسی غیرمجاز.' })
    return null
  }
  if (status === 409) {
    $q.notify({ type: 'negative', message: e?.response?.data?.message || 'تعارض در وضعیت.' })
    return null
  }
  $q.notify({ type: 'negative', message: e?.response?.data?.message || 'خطا در انجام عملیات.' })
  return null
}

async function load () {
  loading.value = true
  try {
    correspondence.value = await correspondenceAPI.get(correspondenceId.value)
    await loadEventUsers()
  } catch (e) {
    correspondence.value = null
    handleError(e)
  } finally {
    loading.value = false
  }
}

function eventAssigneeId (ev: CorrespondenceEvent): number | null {
  const raw = ev.metadata?.user_id ?? ev.metadata?.assigned_to_id
  const id = Number(raw)
  return Number.isFinite(id) && id > 0 ? id : null
}

function eventUserName (ev: CorrespondenceEvent): string {
  const userId = eventAssigneeId(ev)
  if (!userId) return '-'
  return userLabel(eventUsers.value[userId], userId)
}

async function loadEventUsers () {
  const events = correspondence.value?.events || []
  const ids = Array.from(new Set(
    events
      .filter((ev) => ev.event_type === 'assigned')
      .map((ev) => eventAssigneeId(ev))
      .filter((id): id is number => !!id && !eventUsers.value[id])
  ))

  await Promise.all(ids.map(async (id) => {
    try {
      eventUsers.value[id] = await userAPI.getBasic(id)
    } catch {
      // در صورت خطا، فقط شناسه نمایش داده می‌شود
    }
  }))
}

function openRecipientDialog () {
  recipientForm.value = { user_id: null, type: 'to', due_at: null }
  recipientErrors.value = {}
  recipientDialog.value = true
}

function onRecipientTypeChange (type: 'to' | 'cc') {
  if (type === 'cc') {
    recipientForm.value.due_at = null
  }
}

async function submitRecipient () {
  recipientErrors.value = {}
  if (!recipientForm.value.user_id) {
    recipientErrors.value.user_id = 'انتخاب گیرنده الزامی است.'
    return
  }
  actionLoading.value = true
  try {
    await correspondenceAPI.addRecipients(correspondenceId.value, {
      recipients: [{
        user_id: recipientForm.value.user_id,
        type: recipientForm.value.type,
        due_at: recipientForm.value.type === 'cc' ? null : (recipientForm.value.due_at || null)
      }]
    })
    $q.notify({ type: 'positive', message: 'گیرنده اضافه شد.' })
    recipientDialog.value = false
    await load()
  } catch (e) {
    console.error(e)
    const errs = handleError(e)
    if (errs) recipientErrors.value = errs
  } finally {
    actionLoading.value = false
  }
}

async function sendCorrespondence () {
  actionLoading.value = true
  try {
    await correspondenceAPI.send(correspondenceId.value)
    $q.notify({ type: 'positive', message: 'نامه با موفقیت ارسال شد.' })
    await load()
  } catch (e) {
    handleError(e)
  } finally {
    actionLoading.value = false
  }
}

async function uploadAttachment () {
  if (!attachFile.value) return
  attachError.value = ''
  attachLoading.value = true
  try {
    await correspondenceAPI.attach(correspondenceId.value, attachFile.value)
    $q.notify({ type: 'positive', message: 'پیوست بارگذاری شد.' })
    attachFile.value = null
    await load()
  } catch (e: any) {
    const errs = handleError(e)
    if (errs?.file) attachError.value = Array.isArray(errs.file) ? errs.file[0] : errs.file
  } finally {
    attachLoading.value = false
  }
}

async function startAssignment (id: number) {
  actionLoading.value = true
  try {
    await correspondenceAPI.startAssignment(id)
    $q.notify({ type: 'positive', message: 'ارجاع شروع شد.' })
    await load()
  } catch (e) { handleError(e) } finally { actionLoading.value = false }
}

function openResolve (a: CorrespondenceAssignment, mode: 'complete' | 'reject') {
  if (mode === 'complete' && a.status !== 'in_progress') {
    $q.notify({ type: 'negative', message: 'برای تکمیل، ابتدا باید ارجاع را شروع کنید.' })
    return
  }
  resolveTarget.value = a
  resolveMode.value = mode
  resolveNote.value = ''
  resolveDialog.value = true
}

async function submitResolve () {
  if (!resolveTarget.value) return
  actionLoading.value = true
  try {
    if (resolveMode.value === 'complete') {
      await correspondenceAPI.completeAssignment(resolveTarget.value.id, { resolution_note: resolveNote.value || null })
      $q.notify({ type: 'positive', message: 'ارجاع تکمیل شد.' })
    } else {
      await correspondenceAPI.rejectAssignment(resolveTarget.value.id, { resolution_note: resolveNote.value || null })
      $q.notify({ type: 'positive', message: 'ارجاع رد شد.' })
    }
    resolveDialog.value = false
    await load()
  } catch (e) { handleError(e) } finally { actionLoading.value = false }
}

function openChild (a: CorrespondenceAssignment) {
  childTarget.value = a
  childForm.value = { assigned_to_id: null, note: '', due_at: null }
  childErrors.value = {}
  childDialog.value = true
}

async function submitChild () {
  if (!childTarget.value) return
  childErrors.value = {}
  actionLoading.value = true
  try {
    const payload: any = {
      assigned_to_id: childForm.value.assigned_to_id,
      note: childForm.value.note || null,
      due_at: childForm.value.due_at || null
    }
    await correspondenceAPI.createChildAssignment(childTarget.value.id, payload)
    $q.notify({ type: 'positive', message: 'ارجاع فرزند ایجاد شد.' })
    childDialog.value = false
    await load()
  } catch (e: any) {
    const errs = handleError(e)
    if (errs) {
      Object.keys(errs).forEach((k) => { childErrors.value[k] = Array.isArray(errs[k]) ? errs[k][0] : errs[k] })
    }
  } finally { actionLoading.value = false }
}

onMounted(() => {
  load()
})
</script>

<style scoped lang="scss">
.correspondence-workspace {
  font-family: inherit;

  .border-subtle {
    border: 1px solid #edf2f7;
  }

  .border-bottom-subtle {
    border-bottom: 1px solid #edf2f7;
  }

  .border-bottom-dashed {
    border-bottom: 1px dashed #cbd5e0;
  }

  .font-mono {
    font-family: inherit;
    font-variant-numeric: tabular-nums;
  }

  .rounded-xl {
    border-radius: 14px;
  }

  .max-w-400 {
    max-width: 400px;
  }

  .modern-action-btn {
    border-radius: 8px;
    font-weight: 700;
    transition: transform 0.15s ease;
    &:active {
      transform: scale(0.98);
    }
  }

  .primary-glow {
    box-shadow: 0 4px 14px rgba(25, 118, 210, 0.3);
  }

  /* ۱. نوار فرمان بالای صفحه */
  .command-bar {
    .back-circle-btn {
      background: #f7fafc;
      transition: background 0.2s ease;
      &:hover {
        background: #edf2f7;
      }
    }

    .id-tag {
      background: #ebf8ff;
      color: #3182ce;
      padding: 2px 6px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .ref-tag {
      background: #f7fafc;
      color: #718096;
      padding: 2px 6px;
      border-radius: 6px;
      font-size: 0.75rem;
    }

    .subject-title {
      font-size: 1.1rem;
      line-height: 1.4;
      max-width: 600px;
    }
  }

  /* ۲. کارت تب‌ها */
  .main-content-card {
    .tabs-header-strip {
      border-top-left-radius: 14px;
      border-top-right-radius: 14px;
    }

    .modern-tabs {
      :deep(.q-tab__label) {
        font-weight: 700;
        font-size: 0.9rem;
      }
    }

    .reply-chip-indicator {
      background: #ebf8ff;
    }

    .tab-panels-body {
      background: #ffffff;
    }
  }

  /* ۳. برگه سند نامه رسمی */
  .document-sheet {
    .doc-title {
      line-height: 1.6;
    }

    .meta-stamp-box {
      border: 1px solid #e2e8f0;
      min-width: 200px;
      gap: 2px;
    }

    .doc-pills-row {
      border-bottom: 1px solid #edf2f7;
    }

    .pill-chip {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;

      &.pill-confidential { background: #fffaf0; color: #dd6b20; border: 1px solid #feebc8; }
      &.pill-strictly_confidential { background: #fff5f5; color: #e53e3e; border: 1px solid #fed7d7; }
      &.pill-urgent { background: #fffaf0; color: #dd6b20; }
      &.pill-immediate { background: #fff5f5; color: #e53e3e; }
      &:not([class*="pill-confidential"]):not([class*="pill-urgent"]):not([class*="pill-immediate"]) {
        background: #f7fafc;
        color: #4a5568;
      }
    }

    .doc-body-text {
      white-space: pre-wrap;
      line-height: 2.2;
      font-size: 1.05rem;
      word-break: break-word;
      min-height: 160px;
    }
  }

  /* ۴. جریان و کارت‌های ارجاع */
  .assignment-item-box {
    border-right: 4px solid #3182ce;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-right-width: 4px;
    border-radius: 10px;
    padding: 14px 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

    &.status-completed { border-right-color: #38a169; }
    &.status-rejected { border-right-color: #e53e3e; }
    &.status-in_progress { border-right-color: #3182ce; }
    &.status-pending { border-right-color: #d69e2e; }

    &.child {
      background: #f7fafc;
      border-right-width: 3px;
    }
  }

  .assignment-paraph-note {
    background: #f7fafc;
    border-right: 3px solid #cbd5e0;
  }

  .assignment-children-tree {
    border-right: 2px dashed #cbd5e0;
    padding-right: 16px;
  }

  /* ۵. بخش پیوست‌ها */
  .upload-drop-area {
    background: #f7fafc;
    border: 1px dashed #cbd5e0;
  }

  .attachment-modern-card {
    background: #ffffff;
    transition: background 0.15s ease;
    &:hover {
      background: #f7fafc;
    }
    .file-thumb {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #edf2f7;
      border-radius: 6px;
      overflow: hidden;
    }
  }

  /* ۶. سایدبار اطلاعات سریع */
  .side-card {
    .card-head-title {
      border-bottom: 1px solid #edf2f7;
      padding-bottom: 6px;
    }

    .recipient-badge-row {
      background: #f7fafc;
      border: 1px solid #edf2f7;
      .rec-type-tag {
        font-size: 0.68rem;
        font-weight: 800;
        padding: 2px 6px;
        border-radius: 4px;
        &.is-to { background: #ebf8ff; color: #2b6cb0; }
        &.is-cc { background: #e6fffa; color: #234e52; }
      }
    }
  }
}

/* تایم‌لاین فشرده سایدبار */
.compact-timeline {
  padding-left: 0;
  padding-right: 0;

  :deep(.q-timeline__entry) {
    padding-bottom: 10px !important;
    &:last-child { padding-bottom: 0 !important; }
  }

  :deep(.q-timeline__dot) {
    top: 2px !important;
    width: 31px !important;
    min-width: 31px !important;
    &:after {
      top: 22px !important;
      opacity: 0.3;
    }
    .q-icon { font-size: 13px !important; }
  }

  :deep(.q-timeline__title) {
    font-size: 0.82rem !important;
    font-weight: 700 !important;
    margin-bottom: 2px !important;
  }

  :deep(.q-timeline__subtitle) {
    font-size: 0.7rem !important;
    margin-bottom: 2px !important;
    opacity: 0.7;
  }

  :deep(.q-timeline__content) {
    padding-bottom: 0 !important;
  }
}

/* دیالوگ ارجاع فرزند */
.child-dialog-card {
  width: 520px;
  max-width: 92vw;
}

.child-dialog-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #1976d2, #3949ab);
}

.child-dialog-form {
  display: grid;
  gap: 16px;
  padding: 20px;
}

/* ========================================================
   استایل‌های کارت ارجاع و درخت گردش کار (سازگار با RTL)
   ======================================================== */

.border-b-subtle {
  border-bottom: 1px solid #f1f5f9;
}

.border-t-subtle {
  border-top: 1px solid #f1f5f9;
}

.font-mono {
  font-family: inherit;
  font-variant-numeric: tabular-nums;
  direction: ltr;
  display: inline-block;
}

.leading-relaxed {
  line-height: 1.8;
}

.modern-btn {
  border-radius: 6px;
  font-weight: 600;
}

/* کارت اصلی ارجاع */
.assignment-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  /* استفاده از border-inline-start برای سازگاری کامل با postcss-rtl */
  border-inline-start: 4px solid #94a3b8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &.status-completed {
    border-inline-start-color: #10b981;
  }
  &.status-rejected {
    border-inline-start-color: #ef4444;
  }
  &.status-in_progress {
    border-inline-start-color: #3b82f6;
  }
  &.status-pending {
    border-inline-start-color: #f59e0b;
  }

  .status-indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .paraph-banner {
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    border-inline-start: 3px solid #3b82f6;
    &.paraph-child {
      border-inline-start-color: #8b5cf6;
      background: #faf5ff;
    }
  }

  /* کارت ارجاع فرزند */
  &.child-card {
    background: #fafafa;
    border-inline-start-width: 3px;
    border-inline-start-color: #8b5cf6;
    padding: 10px 14px;
    border-radius: 10px;
  }
}

/* ساختار درختی فرزندان - بدون باگ در RTL */
.assignment-children-tree {
  /* به جای margin-right از margin-inline-start استفاده می‌کنیم */
  margin-inline-start: 24px;
  border-inline-start: 2px dashed #cbd5e1;
  padding-inline-start: 16px;
  padding-top: 6px;

  .child-node-item {
    position: relative;
    margin-bottom: 8px;

    /* شاخه اتصال افقی */
    &::before {
      content: '';
      position: absolute;
      top: 18px;
      /* جهت اتصال افقی طبق LTR/RTL هوشمند تنظیم می‌شود */
      inset-inline-start: -16px;
      width: 14px;
      height: 2px;
      border-top: 2px dashed #cbd5e1;
    }
  }
}

/* ========================================================
   بازطراحی هوشمند جعبه متادیتا (assignment-meta-v2)
   ======================================================== */
.assignment-meta-v2 {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;

  &.meta-child {
    background: #ffffff;
    border-color: #e5e7eb;
  }

  .meta-item {
    display: flex;
    align-items: center;
    background: #ffffff;
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid #edf2f7;
    min-height: 32px;
    font-size: 0.78rem;

    .meta-icon {
      color: #94a3b8;
      margin-inline-end: 4px;
    }

    .meta-title {
      color: #64748b;
      font-weight: 500;
      margin-inline-end: 4px;
      white-space: nowrap;
    }

    .meta-val {
      color: #1e293b;
      font-weight: 600;
      margin-inline-start: auto; /* چسبیدن تاریخ به انتهای کادر */
    }

    /* هایلایت‌های شرطی برای خوانایی فوری */
    &.highlight-alert {
      background: #fffbeb;
      border-color: #fef3c7;
      .meta-icon { color: #d97706; }
      .meta-title { color: #b45309; }
      .meta-val { color: #b45309; }
    }

    &.highlight-success {
      background: #f0fdf4;
      border-color: #dcfce7;
      .meta-icon { color: #16a34a; }
      .meta-title { color: #15803d; }
      .meta-val { color: #15803d; }
    }
  }

  /* کارت متمایز یادداشت نتیجه */
  .resolution-note-box {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    line-height: 1.6;
    color: #166534;
  }
}


/* بهینه‌سازی چاپ سند */
@media print {
  .command-bar,
  .tabs-header-strip,
  .upload-drop-area,
  .col-lg-4,
  .q-btn {
    display: none !important;
  }

  .col-lg-8 {
    width: 100% !important;
  }

  .main-content-card {
    border: none !important;
    box-shadow: none !important;
  }
}
</style>
