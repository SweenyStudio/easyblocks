import { ReactElement } from "react";

export function DummyBanner(props: {
  Root: ReactElement;
  DummyComponent: ReactElement;
}) {
  const { Root, DummyComponent } = props;

  return (
    <Root.type {...Root.props} as="div">
      <DummyComponent.type {...DummyComponent.props} as="div" />
    </Root.type>
  );
}

export function DummySelectable(props: { Root: ReactElement }) {
  const { Root } = props;

  return (
    <Root.type {...Root.props} as="div">
      Test
    </Root.type>
  );
}
