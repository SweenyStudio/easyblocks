import { ReactElement } from "react";

export function DummyBanner(props: {
  Root: ReactElement;
  DummyComponent: ReactElement;
}) {
  const { Root, DummyComponent } = props;
  console.log("DummyBanner", props);

  return (
    <Root.type {...Root.props} as="div">
      <DummyComponent.type {...DummyComponent.props} as="div" />
    </Root.type>
  );
}

export function DummySelectable(props: { Root: ReactElement }) {
  const { Root } = props;
  console.log("DummySelectable", props);

  return (
    <Root.type {...Root.props} as="div">
      Test
    </Root.type>
  );
}
