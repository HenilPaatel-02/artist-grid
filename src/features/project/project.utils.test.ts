import {
  createProject,
  createProjectId,
  updateProjectTimestamp,
} from "./project.utils";

describe("project.utils", () => {
  const baseProject = {
    name: "Portrait",

    image: {
      uri: "file:///portrait.jpg",
      width: 1000,
      height: 1200,
    },

    drawingSurface: {
      size: {
        width: 210,
        height: 297,
      },
      unit: "mm",
    },

    gridCalculation: {
      rows: 10,
      columns: 8,
    },

    imageEffects: {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      grayscale: 0,
      opacity: 100,
    },

    gridStyling: {
      showGrid: true,
      gridColor: "#000000",
      gridOpacity: 70,
      gridStrokeWidth: 1,
      showRowLabels: true,
      showColumnLabels: true,
      labelColor: "#000000",
      labelSize: 10,
    },
  } as any;

  it("creates a project id", () => {
    const id = createProjectId();

    expect(id).toBeTruthy();
    expect(typeof id).toBe("string");
  });

  it("creates a project with generated metadata", () => {
    const project = createProject(baseProject);

    expect(project.id).toBeTruthy();
    expect(project.createdAt).toBeTruthy();
    expect(project.updatedAt).toBeTruthy();

    expect(project.name).toBe("Portrait");
  });

  it("preserves project data", () => {
    const project = createProject(baseProject);

    expect(project.image).toEqual(baseProject.image);

    expect(project.drawingSurface).toEqual(baseProject.drawingSurface);

    expect(project.gridCalculation).toEqual(baseProject.gridCalculation);

    expect(project.imageEffects).toEqual(baseProject.imageEffects);

    expect(project.gridStyling).toEqual(baseProject.gridStyling);
  });

  it("updates the updatedAt timestamp", async () => {
    const project = createProject(baseProject);

    await new Promise((resolve) => setTimeout(resolve, 5));

    const updated = updateProjectTimestamp(project);

    expect(updated.updatedAt).not.toBe(project.updatedAt);

    expect(updated.createdAt).toBe(project.createdAt);

    expect(updated.id).toBe(project.id);
  });
  it("preserves id and createdAt when updating a project", () => {
    jest.useFakeTimers();

    try {
      jest.setSystemTime(new Date("2026-10-07T12:30:22.000Z"));

      const project = createProject(baseProject);

      const originalId = project.id;
      const originalCreatedAt = project.createdAt;
      const originalUpdatedAt = project.updatedAt;

      jest.setSystemTime(new Date("2026-10-07T12:30:23.000Z"));

      const updatedProject = updateProjectTimestamp({
        ...project,
        name: "Updated Portrait",
      });

      expect(updatedProject.id).toBe(originalId);

      expect(updatedProject.createdAt).toBe(originalCreatedAt);

      expect(updatedProject.name).toBe("Updated Portrait");

      expect(updatedProject.updatedAt).not.toBe(originalUpdatedAt);
    } finally {
      jest.useRealTimers();
    }
  });
});
