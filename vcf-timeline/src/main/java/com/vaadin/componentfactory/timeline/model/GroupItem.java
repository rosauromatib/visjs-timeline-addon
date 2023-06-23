package com.vaadin.componentfactory.timeline.model;

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

import elemental.json.Json;
import elemental.json.JsonObject;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/** Representation of a timeline item. */
public class GroupItem {

  private String id;

  private String content;

  private int treeLevel = 1;

  private String nestedGroups;

  private boolean visible;

  public GroupItem() {}

  public GroupItem(int id, String content, String nestedGroups, boolean visible, int treeLevel) {
    this.setId(String.valueOf(id));
    this.setContent(content);
    this.setNestedGroups(nestedGroups);
    this.setVisible(visible);
    this.setTreeLevel(treeLevel);
  }

  public GroupItem(int id, String content, boolean visible, int treeLevel) {
    this.setId(String.valueOf(id));
    this.setContent(content);
    this.setNestedGroups(null);
    this.setVisible(visible);
    this.setTreeLevel(treeLevel);
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public String getNestedGroups() {
    return nestedGroups;
  }

  public void setNestedGroups(String nestedGroups) {
    this.nestedGroups = nestedGroups;
  }

  public boolean isVisible() {
    return visible;
  }

  public void setVisible(boolean visible) {
    this.visible = visible;
  }
  @Override
  public int hashCode() {
    return Objects.hash(id);
  }

  public int getTreeLevel() {
    return treeLevel;
  }

  public void setTreeLevel(int treeLevel) {
    this.treeLevel = treeLevel;
  }


  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null) return false;
    if (getClass() != obj.getClass()) return false;
    GroupItem other = (GroupItem) obj;
    return Objects.equals(id, other.id);
  }

  public String toJSON() {
    JsonObject js = Json.createObject();
    Optional.ofNullable(getId()).ifPresent(v -> js.put("id", v));
    Optional.ofNullable(getContent()).ifPresent(v -> js.put("content", v));
    Optional.ofNullable(getTreeLevel()).ifPresent(v -> js.put("treeLevel", v));
    Optional.ofNullable(getNestedGroups()).ifPresent(v -> js.put("nestedGroups", v));
    Optional.ofNullable(isVisible()).ifPresent(v -> js.put("visible", v));

    return js.toJson();
  }
}
