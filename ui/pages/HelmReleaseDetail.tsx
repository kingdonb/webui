import { Box } from "@material-ui/core";
import * as React from "react";
import styled from "styled-components";
import ConditionsTable from "../components/ConditionsTable";
import Flex from "../components/Flex";
import KeyValueTable from "../components/KeyValueTable";
import Link from "../components/Link";
import Panel from "../components/Panel";
import {
  SourceType,
  useHelmReleases,
  useKubernetesContexts,
  useNavigation,
} from "../lib/hooks";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)`
  ${Panel} {
    width: 100%;
    margin-right: 16px;
  }

  .MuiBox-root {
    margin-left: 0 !important;
  }
`;

function HelmReleaseDetail({ className }: Props) {
  const { query } = useNavigation();
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const helmReleases = useHelmReleases(currentContext, currentNamespace);
  const helmRelease = helmReleases[query.helmReleaseId as string];

  if (!helmRelease) {
    return null;
  }

  return (
    <div className={className}>
      <h2>{query.helmReleaseId}</h2>
      <Box m={2}>
        <Flex wide>
          <Panel title="Info">
            <KeyValueTable
              columns={2}
              pairs={[
                { key: "Interval", value: helmRelease.interval },
                { key: "Chart", value: helmRelease.chartname },
                { key: "Version", value: helmRelease.version },
              ]}
            />
          </Panel>
          <Panel title="Source">
            <KeyValueTable
              columns={2}
              overrides={{
                Name: [
                  <Link
                    to={formatURL(
                      PageRoute.SourceDetail,
                      currentContext,
                      currentNamespace,
                      {
                        sourceType: SourceType.Helm,
                        sourceId: helmRelease.sourcename,
                      }
                    )}
                  >
                    {helmRelease.sourcename}
                  </Link>,
                  "Source",
                ],
              }}
              pairs={[
                { key: "Name", value: helmRelease.sourcename },
                { key: "Kind", value: helmRelease.sourcekind },
                { key: "Namespace", value: helmRelease.sourcenamespace },
              ]}
            />
          </Panel>
        </Flex>
      </Box>
      <Box m={2}>
        <Panel title="Conditions">
          <ConditionsTable conditions={helmRelease.conditions} />
        </Panel>
      </Box>
    </div>
  );
}

export default Styled(HelmReleaseDetail);
