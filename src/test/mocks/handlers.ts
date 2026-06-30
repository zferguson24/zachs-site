import { http, HttpResponse } from "msw";
import {
  baseCharacter,
  warriorGearPlan,
  druidGearPlan,
  searchResults,
  emptySearchResults,
} from "./fixtures";

export const handlers = [
  http.get("/api/characters/:name", ({ params }) => {
    if (params.name === "NOTFOUND") {
      return new HttpResponse(null, { status: 404 });
    }
    if (params.name === "DRUID") {
      return HttpResponse.json({ ...baseCharacter, name: "DRUID", characterClass: "DRUID" });
    }
    return HttpResponse.json(baseCharacter);
  }),

  http.get("/api/characters/:name/gear-plan", ({ params, request }) => {
    const url = new URL(request.url);
    const stat = url.searchParams.get("preferredStat");

    if (params.name === "DRUID") {
      if (stat === "Intellect") {
        return HttpResponse.json({ ...druidGearPlan, resolvedStat: "Intellect" });
      }
      return HttpResponse.json(druidGearPlan);
    }

    return HttpResponse.json(warriorGearPlan);
  }),

  http.patch("/api/characters/:name/gear", () => {
    return HttpResponse.json(baseCharacter);
  }),

  http.delete("/api/characters/:name/gear", () => {
    return HttpResponse.json(baseCharacter);
  }),

  http.get("/api/gear/search", ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") ?? "";
    if (q.length < 3) {
      return HttpResponse.json(emptySearchResults);
    }
    if (q === "noresults") {
      return HttpResponse.json(emptySearchResults);
    }
    return HttpResponse.json(searchResults);
  }),
];
