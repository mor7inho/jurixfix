-- CreateIndex
CREATE INDEX "Case_slug_idx" ON "Case"("slug");

-- CreateIndex
CREATE INDEX "Case_code_idx" ON "Case"("code");

-- CreateIndex
CREATE INDEX "Case_isPublished_idx" ON "Case"("isPublished");

-- CreateIndex
CREATE INDEX "Case_priority_idx" ON "Case"("priority");

-- CreateIndex
CREATE INDEX "Case_level_idx" ON "Case"("level");

-- CreateIndex
CREATE INDEX "Case_topic_idx" ON "Case"("topic");

-- CreateIndex
CREATE INDEX "Case_axis_idx" ON "Case"("axis");
