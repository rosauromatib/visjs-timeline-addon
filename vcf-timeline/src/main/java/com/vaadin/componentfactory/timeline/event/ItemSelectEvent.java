/*-
 * #%L
 * Timeline
 * %%
 * Copyright (C) 2021 Vaadin Ltd
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
package com.vaadin.componentfactory.timeline.event;

import com.vaadin.componentfactory.timeline.Timeline;
import com.vaadin.flow.component.ComponentEvent;
import java.time.LocalDateTime;

/**
 * Event thrown when an item is resized.
 */
public class ItemSelectEvent extends ItemResizeEvent {

    private final String itemId;
    private final LocalDateTime newStart;
    private final LocalDateTime newEnd;
    private boolean cancelled = false;

    public ItemSelectEvent(
            Timeline source,
            String itemId,
            LocalDateTime newStart,
            LocalDateTime newEnd,
            boolean fromClient) {
        super(source, itemId, newStart, newEnd, fromClient);
        this.itemId = itemId;
        this.newStart = newStart;
        this.newEnd = newEnd;
    }

    public String getItemId() {
        return itemId;
    }

    public LocalDateTime getNewStart() {
        return newStart;
    }

    public LocalDateTime getNewEnd() {
        return newEnd;
    }

    public boolean isCancelled() {
        return cancelled;
    }

    public void setCancelled(boolean cancelled) {
        this.cancelled = cancelled;
    }

    public Timeline getTimeline() {
        return (Timeline) source;
    }
}


