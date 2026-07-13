import { useEffect, useMemo, useState } from "react";
import { apiErrorMessage, getJson, sendJson } from "../services/api";
import { CarFilters, CarMatchRequest, CarMatchResponse } from "../types/cars";
import FilterPanel, { FilterState } from "../components/cars/FilterPanel";
import AxisCard from "../components/cars/AxisCard";
import ResultsPanel from "../components/cars/ResultsPanel";
import { Page, Spinner } from "../styles/shared";
import {
  Content,
  ErrorLine,
  HintLine,
  MatchButton,
  PageSubtitle,
  PageTitle,
  PreferencesGrid,
  SectionLabel,
  SubmitRow,
} from "./CarSelection.styles";

const INITIAL_FILTERS: FilterState = {
  maxPrice: "",
  bodyStyles: [],
  powertrains: [],
  drivetrains: [],
  manualOnly: false,
};

// Matchbox: hard filters narrow the catalog, importance-weighted preferences
// rank what's left, and the backend returns a deterministic top 3 with a
// crowned winner. All scoring happens server-side (/api/cars/match).
const CarSelection: React.FC = () => {
  const [options, setOptions] = useState<CarFilters | null>(null);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [performance, setPerformance] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [size, setSize] = useState(0);
  const [sizeTarget, setSizeTarget] = useState(5);

  const [response, setResponse] = useState<CarMatchResponse | null>(null);
  const [matching, setMatching] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getJson<CarFilters>("/api/cars/filters", controller.signal)
      .then(setOptions)
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setOptionsError(apiErrorMessage(err, "Could not load the car catalog."));
        }
      });
    return () => controller.abort();
  }, []);

  const request = useMemo<CarMatchRequest>(() => {
    const body: CarMatchRequest = {};
    const maxPrice = Number(filters.maxPrice);
    if (filters.maxPrice !== "" && Number.isFinite(maxPrice) && maxPrice > 0) {body.maxPrice = maxPrice;}
    if (filters.bodyStyles.length > 0) {body.bodyStyles = filters.bodyStyles;}
    if (filters.powertrains.length > 0) {body.powertrains = filters.powertrains;}
    if (filters.drivetrains.length > 0) {body.drivetrains = filters.drivetrains;}
    if (filters.manualOnly) {body.manualOnly = true;}
    if (performance > 0) {body.performanceImportance = performance;}
    if (efficiency > 0) {body.efficiencyImportance = efficiency;}
    if (size > 0) {
      body.sizeImportance = size;
      body.sizeTarget = sizeTarget;
    }
    return body;
  }, [filters, performance, efficiency, size, sizeTarget]);

  const hasPreference = performance + efficiency + size > 0;

  const findMatch = async () => {
    setMatching(true);
    setMatchError(null);
    try {
      setResponse(await sendJson<CarMatchResponse>("/api/cars/match", "POST", request));
    } catch (err: unknown) {
      setResponse(null);
      setMatchError(apiErrorMessage(err, "Match request failed."));
    } finally {
      setMatching(false);
    }
  };

  return (
    <Page>
      <Content>
        <PageTitle>Matchbox</PageTitle>
        <PageSubtitle>
          Set your non-negotiables, weight what you care about, and get a deterministic top 3 from the current
          model-year catalog{options ? ` (${options.catalogSize} cars)` : ""}.
        </PageSubtitle>

        {!options && !optionsError && <Spinner />}
        {optionsError && <ErrorLine role="alert">{optionsError}</ErrorLine>}

        {options && (
          <>
            <SectionLabel>Hard filters</SectionLabel>
            <FilterPanel options={options} state={filters} onChange={setFilters} />

            <SectionLabel>What matters to you</SectionLabel>
            <PreferencesGrid>
              <AxisCard label="Performance" importance={performance} onImportanceChange={setPerformance} />
              <AxisCard label="Efficiency" importance={efficiency} onImportanceChange={setEfficiency} />
              <AxisCard
                label="Size"
                importance={size}
                onImportanceChange={setSize}
                target={sizeTarget}
                onTargetChange={setSizeTarget}
                targetLabels={["Small", "Large"]}
              />
            </PreferencesGrid>

            <SubmitRow>
              <MatchButton type="button" onClick={findMatch} disabled={!hasPreference || matching}>
                {matching ? "Matching…" : "Find my match"}
              </MatchButton>
              {!hasPreference && <HintLine>Set at least one preference above 0 to match.</HintLine>}
              {matchError && <ErrorLine role="alert">{matchError}</ErrorLine>}
            </SubmitRow>

            {response && <ResultsPanel response={response} />}
          </>
        )}
      </Content>
    </Page>
  );
};

export default CarSelection;
