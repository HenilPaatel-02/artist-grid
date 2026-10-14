import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  createStoredProject,
  deleteStoredProject,
  getAllProjects,
  updateStoredProject,
} from "./project.repository";

import { createProject } from "./project.utils";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

describe("project.repository", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();

    jest.clearAllMocks();
  });

  it("creates and retrieves a project", async () => {
    const project = createProject({
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
    } as any);

    await createStoredProject(project);

    const projects = await getAllProjects();

    expect(projects).toHaveLength(1);

    expect(projects[0].id).toBe(project.id);

    expect(projects[0].name).toBe("Portrait");
  });

  it("updates an existing project instead of creating a duplicate", async () => {
    const project = createProject({
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
    } as any);

    await createStoredProject(project);

    const updatedProject = {
      ...project,
      name: "Updated Portrait",
      gridStyling: {
        ...project.gridStyling,
        gridOpacity: 40,
      },
    };

    await updateStoredProject(updatedProject);

    const projects = await getAllProjects();

    expect(projects).toHaveLength(1);

    expect(projects[0].id).toBe(project.id);

    expect(projects[0].name).toBe("Updated Portrait");

    expect(projects[0].gridStyling.gridOpacity).toBe(40);
  });

  it("deletes an existing project", async () => {
    const project = createProject({
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
    } as any);

    await createStoredProject(project);

    await deleteStoredProject(project.id);

    const projects = await getAllProjects();

    expect(projects).toHaveLength(0);
  });

  it("throws when deleting a project that does not exist", async () => {
    await expect(deleteStoredProject("does-not-exist")).rejects.toThrow(
      'Project "does-not-exist" does not exist.',
    );
  });
});
