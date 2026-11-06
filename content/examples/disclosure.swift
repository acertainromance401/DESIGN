import SwiftUI

struct DisclosureExample: View {
    @State private var expanded = false

    var body: some View {
        DisclosureGroup("Delivery details", isExpanded: $expanded) {
            Text("Delivery estimates depend on the destination. This is sample information.")
                .fixedSize(horizontal: false, vertical: true)
                .padding(.vertical, 8)
        }
        .padding()
    }
}
